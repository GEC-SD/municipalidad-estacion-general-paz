export type FinancialDocumentType = 'presupuesto' | 'balance';

export type FinancialDocument = {
  id: string;
  title: string;
  document_type: FinancialDocumentType;
  pdf_urls: string[];
  created_at: string;
  updated_at: string;
};

export type FinancialDocumentFormData = Pick<
  FinancialDocument,
  'title' | 'document_type' | 'pdf_urls'
>;
