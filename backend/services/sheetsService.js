// c:\rojgar-mitra\backend\services\sheetsService.js
const { google } = require('googleapis');

class SheetsService {
  constructor() {
    this._sheets = null;
  }

  _getClient() {
    // Re-create client each time so auth errors don't get silently cached
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.SPREADSHEET_ID;

    if (!email || !key || !spreadsheetId) {
      throw new Error(
        'Google Sheets not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and SPREADSHEET_ID in backend/.env'
      );
    }

    // Decode escaped newlines that come from .env file quoting
    const decodedKey = key.replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
      email,
      key: decodedKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
  }

  get spreadsheetId() {
    const id = process.env.SPREADSHEET_ID;
    if (!id) throw new Error('SPREADSHEET_ID env var is not set');
    return id;
  }

  /**
   * Get all rows from a sheet as array of objects using row 1 as headers.
   * Throws a descriptive error if the sheet tab does not exist.
   */
  async getSheetData(sheetName) {
    const sheets = this._getClient();
    console.log(`[SheetsService] getSheetData("${sheetName}") spreadsheetId=${this.spreadsheetId}`);
    let response;
    try {
      response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: sheetName,
      });
    } catch (err) {
      const status = err?.response?.status;
      const gErr = err?.response?.data?.error?.message || err.message;
      if (status === 400) {
        throw new Error(
          `Sheet tab "${sheetName}" not found in spreadsheet. ` +
          `Make sure you have a tab named exactly "${sheetName}" in your Google Spreadsheet. ` +
          `Google error: ${gErr}`
        );
      }
      if (status === 403) {
        throw new Error(
          `Permission denied accessing spreadsheet. ` +
          `Share the spreadsheet with "${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}" as Editor. ` +
          `Google error: ${gErr}`
        );
      }
      throw new Error(`Google Sheets API error (${status}): ${gErr}`);
    }
    const rows = response.data.values || [];
    console.log(`[SheetsService] "${sheetName}": ${rows.length} rows (including header)`);
    if (rows.length < 1) return [];
    const headers = rows[0];
    return rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i] ?? ''; });
      return obj;
    });
  }

  /**
   * Append a row. rowData is an object matching sheet headers.
   * Returns the updated range string from Google Sheets API.
   */
  async appendRow(sheetName, rowData) {
    const sheets = this._getClient();
    console.log(`[SheetsService] appendRow("${sheetName}") keys=${Object.keys(rowData).join(',')}`);

    // Read header row first so we write values in the correct column order
    let headerResp;
    try {
      headerResp = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!1:1`,
      });
    } catch (err) {
      const gErr = err?.response?.data?.error?.message || err.message;
      const status = err?.response?.status;
      if (status === 400) {
        throw new Error(
          `Cannot read headers from sheet "${sheetName}". ` +
          `Ensure the tab exists and row 1 contains column headers. Google error: ${gErr}`
        );
      }
      throw new Error(`Failed to read headers from "${sheetName}": ${gErr}`);
    }

    const headers = (headerResp.data.values || [[]])[0] || [];
    if (headers.length === 0) {
      throw new Error(
        `Sheet "${sheetName}" has no headers in row 1. ` +
        `Add column headers to row 1 exactly matching the documented schema.`
      );
    }
    console.log(`[SheetsService] "${sheetName}" headers: ${headers.join(', ')}`);

    const rowValues = headers.map(h => {
      const v = rowData[h];
      if (v === undefined || v === null) return '';
      if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
      return String(v);
    });

    let appendResp;
    try {
      appendResp = await sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: sheetName,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [rowValues] },
      });
    } catch (err) {
      const gErr = err?.response?.data?.error?.message || err.message;
      throw new Error(`Failed to append row to "${sheetName}": ${gErr}`);
    }

    const updatedRange = appendResp.data.updates?.updatedRange;
    console.log(`[SheetsService] appendRow success: ${updatedRange}`);
    return updatedRange;
  }

  /**
   * Update a row by its data row index (1-based, not counting header row).
   * dataRowIndex 1 = first data row = sheet row 2.
   */
  async updateRow(sheetName, dataRowIndex, rowData) {
    const sheets = this._getClient();
    console.log(`[SheetsService] updateRow("${sheetName}", dataRowIndex=${dataRowIndex})`);

    const headerResp = await sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!1:1`,
    });
    const headers = (headerResp.data.values || [[]])[0] || [];
    const rowValues = headers.map(h => {
      const v = rowData[h];
      if (v === undefined || v === null) return '';
      if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
      return String(v);
    });
    const sheetRow = dataRowIndex + 1; // +1 for header row

    await sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!A${sheetRow}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [rowValues] },
    });
    console.log(`[SheetsService] updateRow success: sheet row ${sheetRow}`);
  }

  /**
   * Delete a row by its sheet row number (1-based, INCLUDING the header row).
   * So the first data row = sheetRowNumber 2.
   */
  async deleteSheetRow(sheetName, sheetRowNumber) {
    const sheets = this._getClient();
    console.log(`[SheetsService] deleteSheetRow("${sheetName}", sheetRow=${sheetRowNumber})`);

    const meta = await sheets.spreadsheets.get({ spreadsheetId: this.spreadsheetId });
    const sheet = meta.data.sheets.find(s => s.properties.title === sheetName);
    if (!sheet) throw new Error(`Sheet tab "${sheetName}" not found in spreadsheet`);
    const sheetId = sheet.properties.sheetId;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId,
              dimension: 'ROWS',
              startIndex: sheetRowNumber - 1,   // 0-based
              endIndex: sheetRowNumber,
            },
          },
        }],
      },
    });
    console.log(`[SheetsService] deleteSheetRow success`);
  }
}

module.exports = new SheetsService();
