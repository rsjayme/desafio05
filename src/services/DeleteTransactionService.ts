import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const transactionToRemove = await transactionRepository.findOne(id);
    if (!transactionToRemove) {
      throw new AppError('Unable to find transaction');
    }
    await transactionRepository.remove(transactionToRemove);

    return transactionToRemove;
  }
}

export default DeleteTransactionService;
