// Serviço de geração de PDF de exames médicos

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { ExamEntry, User } from '../types';
import { formatDate, formatDateTime } from '../utils';

const EXAM_TYPES: Record<string, { label: string; icon: string }> = {
  blood: { label: 'Exame de Sangue', icon: '🩸' },
  urine: { label: 'Exame de Urina', icon: '💧' },
  ultrasound: { label: 'Ultrassom', icon: '👶' },
  other: { label: 'Outro', icon: '📋' },
};

/**
 * Gera HTML de um exame individual
 */
function generateExamHTML(exam: ExamEntry, user?: User): string {
  const examType = EXAM_TYPES[exam.type] || EXAM_TYPES.other;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #212121;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #81C784;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #81C784;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: #757575;
          margin: 5px 0;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section-title {
          background-color: #E8F5E9;
          padding: 10px;
          border-left: 4px solid #81C784;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }
        .info-item {
          padding: 10px;
          background-color: #FAFAFA;
          border-radius: 5px;
        }
        .info-label {
          font-size: 12px;
          color: #757575;
          margin-bottom: 5px;
        }
        .info-value {
          font-size: 16px;
          font-weight: bold;
          color: #212121;
        }
        .results-box {
          background-color: #F5F5F5;
          border-left: 4px solid #64B5F6;
          padding: 15px;
          margin: 15px 0;
          border-radius: 5px;
          white-space: pre-wrap;
        }
        .notes-box {
          background-color: #FFF9C4;
          border-left: 4px solid #FFB74D;
          padding: 15px;
          margin: 15px 0;
          border-radius: 5px;
          white-space: pre-wrap;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #E0E0E0;
          text-align: center;
          color: #757575;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${examType.icon} Relatório de Exame - NutriGest</h1>
        ${user ? `<p>${user.name}</p>` : ''}
        <p>Data do Exame: ${formatDate(exam.date)}</p>
        ${user ? `<p>Semana Gestacional: ${user.gestationalWeek} semanas</p>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Informações do Exame</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Nome do Exame</div>
            <div class="info-value">${exam.name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Tipo</div>
            <div class="info-value">${examType.icon} ${examType.label}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Data</div>
            <div class="info-value">${formatDate(exam.date)}</div>
          </div>
          ${exam.doctor ? `
            <div class="info-item">
              <div class="info-label">Médico</div>
              <div class="info-value">${exam.doctor}</div>
            </div>
          ` : ''}
          ${exam.clinic ? `
            <div class="info-item">
              <div class="info-label">Clínica</div>
              <div class="info-value">${exam.clinic}</div>
            </div>
          ` : ''}
        </div>
      </div>

      ${exam.results ? `
        <div class="section">
          <div class="section-title">Resultados</div>
          <div class="results-box">
            ${exam.results}
          </div>
        </div>
      ` : ''}

      ${exam.notes ? `
        <div class="section">
          <div class="section-title">Observações</div>
          <div class="notes-box">
            ${exam.notes}
          </div>
        </div>
      ` : ''}

      <div class="footer">
        <p>Relatório gerado pelo NutriGest em ${formatDate(new Date())}</p>
        <p>Este relatório é apenas informativo e não substitui a orientação médica profissional.</p>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Gera HTML de múltiplos exames
 */
function generateMultipleExamsHTML(exams: ExamEntry[], user?: User): string {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #212121;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #81C784;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #81C784;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: #757575;
          margin: 5px 0;
        }
        .exam-section {
          margin-bottom: 40px;
          page-break-inside: avoid;
          border: 1px solid #E0E0E0;
          border-radius: 5px;
          padding: 20px;
        }
        .exam-header {
          background-color: #E8F5E9;
          padding: 15px;
          border-left: 4px solid #81C784;
          margin-bottom: 15px;
        }
        .exam-title {
          font-size: 20px;
          font-weight: bold;
          color: #212121;
          margin-bottom: 5px;
        }
        .exam-date {
          color: #757575;
          font-size: 14px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        .info-item {
          padding: 10px;
          background-color: #FAFAFA;
          border-radius: 5px;
        }
        .info-label {
          font-size: 12px;
          color: #757575;
          margin-bottom: 5px;
        }
        .info-value {
          font-size: 14px;
          font-weight: bold;
          color: #212121;
        }
        .results-box {
          background-color: #F5F5F5;
          border-left: 4px solid #64B5F6;
          padding: 15px;
          margin: 15px 0;
          border-radius: 5px;
          white-space: pre-wrap;
        }
        .notes-box {
          background-color: #FFF9C4;
          border-left: 4px solid #FFB74D;
          padding: 15px;
          margin: 15px 0;
          border-radius: 5px;
          white-space: pre-wrap;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #E0E0E0;
          text-align: center;
          color: #757575;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📋 Histórico de Exames - NutriGest</h1>
        ${user ? `<p>${user.name}</p>` : ''}
        <p>Total de Exames: ${exams.length}</p>
        ${user ? `<p>Semana Gestacional: ${user.gestationalWeek} semanas</p>` : ''}
      </div>

      ${exams.map((exam) => {
        const examType = EXAM_TYPES[exam.type] || EXAM_TYPES.other;
        return `
          <div class="exam-section">
            <div class="exam-header">
              <div class="exam-title">${examType.icon} ${exam.name}</div>
              <div class="exam-date">${formatDate(exam.date)}</div>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Tipo</div>
                <div class="info-value">${examType.label}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Data</div>
                <div class="info-value">${formatDate(exam.date)}</div>
              </div>
              ${exam.doctor ? `
                <div class="info-item">
                  <div class="info-label">Médico</div>
                  <div class="info-value">${exam.doctor}</div>
                </div>
              ` : ''}
              ${exam.clinic ? `
                <div class="info-item">
                  <div class="info-label">Clínica</div>
                  <div class="info-value">${exam.clinic}</div>
                </div>
              ` : ''}
            </div>
            ${exam.results ? `
              <div>
                <strong>Resultados:</strong>
                <div class="results-box">${exam.results}</div>
              </div>
            ` : ''}
            ${exam.notes ? `
              <div>
                <strong>Observações:</strong>
                <div class="notes-box">${exam.notes}</div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}

      <div class="footer">
        <p>Relatório gerado pelo NutriGest em ${formatDate(new Date())}</p>
        <p>Este relatório é apenas informativo e não substitui a orientação médica profissional.</p>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Gera PDF de um exame individual
 */
export async function generateExamPDF(exam: ExamEntry, user?: User): Promise<string> {
  try {
    const html = generateExamHTML(exam, user);
    const { uri } = await Print.printToFileAsync({ html });
    return uri;
  } catch (error) {
    console.error('Erro ao gerar PDF do exame:', error);
    throw new Error('Não foi possível gerar o PDF do exame');
  }
}

/**
 * Gera PDF de múltiplos exames
 */
export async function generateMultipleExamsPDF(exams: ExamEntry[], user?: User): Promise<string> {
  try {
    if (exams.length === 0) {
      throw new Error('Nenhum exame selecionado');
    }
    const html = generateMultipleExamsHTML(exams, user);
    const { uri } = await Print.printToFileAsync({ html });
    return uri;
  } catch (error) {
    console.error('Erro ao gerar PDF dos exames:', error);
    throw new Error('Não foi possível gerar o PDF dos exames');
  }
}

/**
 * Compartilha PDF de exame
 */
export async function shareExamPDF(pdfUri: string): Promise<void> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Compartilhamento não disponível neste dispositivo');
    }
    await Sharing.shareAsync(pdfUri);
  } catch (error) {
    console.error('Erro ao compartilhar PDF do exame:', error);
    throw new Error('Não foi possível compartilhar o PDF do exame');
  }
}

