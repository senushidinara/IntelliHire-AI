import type { AnalysisResult, ComparisonResult } from '../types';

/**
 * Helper to trigger a file download in the browser.
 * @param filename The desired name of the file.
 * @param content The string content of the file.
 * @param mimeType The MIME type of the file.
 */
function downloadFile(filename: string, content: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Escapes a string to be safely included in a CSV cell.
 * It handles commas, double quotes, and newlines.
 * @param cell The content of the cell.
 * @returns A CSV-safe string.
 */
function escapeCsvCell(cell: string | number): string {
    const strCell = String(cell).trim();
    // If the cell contains a comma, newline, or double quote, enclose it in double quotes.
    if (/[",\n]/.test(strCell)) {
        // Also, double up any existing double quotes within the string.
        return `"${strCell.replace(/"/g, '""')}"`;
    }
    return strCell;
}

/**
 * Generates and downloads a CSV file for a single candidate's analysis.
 * @param analysis The analysis result object.
 * @param jobTitle The title of the job applied for.
 * @param candidateName The name of the candidate.
 */
export const exportSingleCandidateToCsv = (analysis: AnalysisResult, jobTitle: string, candidateName: string) => {
    const { recommendation, matchScore, summary, strengths, weaknesses } = analysis;

    const rows = [
        ['Category', 'Details'],
        ['Job Title', jobTitle],
        ['Candidate Name', candidateName],
        ['Recommendation', recommendation],
        ['Match Score', `${matchScore}%`],
        ['Summary', summary],
        ['Strengths', strengths.map(s => `- ${s}`).join('\n')],
        ['Weaknesses', weaknesses.map(w => `- ${w}`).join('\n')],
    ];

    const csvContent = rows.map(row => row.map(escapeCsvCell).join(',')).join('\n');
    const safeCandidateName = candidateName.replace(/[^a-z0-9]/gi, '_');
    downloadFile(`IntelliHire_Analysis_${safeCandidateName}.csv`, csvContent, 'text/csv;charset=utf-8;');
};

/**
 * Generates and downloads a CSV file for a multi-candidate comparison.
 * @param result The comparison result object.
 * @param jobTitle The title of the job applied for.
 */
export const exportComparisonToCsv = (result: ComparisonResult, jobTitle: string) => {
    const { comparisonSummary, candidateAnalyses } = result;

    const headers = ['Metric', ...candidateAnalyses.map(c => c.name)];
    
    const dataRows = [
        ['Recommendation', ...candidateAnalyses.map(c => c.recommendation)],
        ['Match Score', ...candidateAnalyses.map(c => `${c.matchScore}%`)],
        ['Summary', ...candidateAnalyses.map(c => c.summary)],
        ['Strengths', ...candidateAnalyses.map(c => c.strengths.map(s => `- ${s}`).join('\n'))],
        ['Weaknesses', ...candidateAnalyses.map(c => c.weaknesses.map(w => `- ${w}`).join('\n'))],
    ];

    let csvContent = `Comparison for Job Title:,"${escapeCsvCell(jobTitle)}"\n`;
    csvContent += `Overall Summary:,"${escapeCsvCell(comparisonSummary)}"\n\n`;

    csvContent += headers.map(escapeCsvCell).join(',') + '\n';
    dataRows.forEach(row => {
        csvContent += row.map(escapeCsvCell).join(',') + '\n';
    });

    const safeJobTitle = jobTitle.replace(/[^a-z0-9]/gi, '_');
    downloadFile(`IntelliHire_Comparison_${safeJobTitle}.csv`, csvContent, 'text/csv;charset=utf-8;');
};