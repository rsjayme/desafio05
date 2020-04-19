import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import UploadConfig from '../config/upload';

const transactionsRouter = Router();
const upload = multer(UploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepository.find();

  const balance = await transactionRepository.getBalance();

  const returnObj = {
    transactions,
    balance,
  };

  return response.json(returnObj);
});

transactionsRouter.post('/', async (request, response) => {
  const createTransaction = new CreateTransactionService();
  const { title, value, type, category } = request.body;

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransaction = new DeleteTransactionService();
  await deleteTransaction.execute(id);

  return response.status(200).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransaction = new ImportTransactionsService();
    const transactions = await importTransaction.execute({
      csvPath: UploadConfig.directory,
      csvFileName: request.file.filename,
    });
    return response.json(transactions);
  },
);

export default transactionsRouter;
