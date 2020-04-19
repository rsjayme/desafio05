import path from 'path';
import csv from 'csvtojson';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import AppError from '../errors/AppError';

interface Request {
  csvFileName: string;
  csvPath: string;
}
// id, title, type, value
interface Teste {
  category: string;
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

class ImportTransactionsService {
  async execute({ csvPath, csvFileName }: Request): Promise<Transaction[]> {
    const csvFile = path.join(csvPath, csvFileName);
    const createTransaction = new CreateTransactionService();
    const parsedTransaction = await csv().fromFile(csvFile);
    const transactions: Transaction[] = [];

    async function addOnDb(): Promise<void> {
      // const mapping = parsedTransaction.map(async transaction => {
      //   await createTransaction.execute(transaction);
      //   transactions.push(transaction);
      // });
      // await Promise.all(mapping);
      // eslint-disable-next-line no-restricted-syntax
      for (const transaction of parsedTransaction) {
        // eslint-disable-next-line no-await-in-loop
        const transactionAdded = await createTransaction.execute(transaction);
        transactions.push(transactionAdded);
      }
    }

    await addOnDb();
    return transactions;
  }
}

export default ImportTransactionsService;
