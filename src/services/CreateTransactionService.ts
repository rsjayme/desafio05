// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);
    const myBalance = await transactionRepository.getBalance();
    if (type === 'outcome' && value > myBalance.total) {
      throw new AppError("You don't have enought balance for this operation.");
    }
    let categoryDb = await categoryRepository.findOne({
      title: category,
    });

    if (!categoryDb) {
      categoryDb = categoryRepository.create({
        title: category,
      });
      categoryDb = await categoryRepository.save(categoryDb);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryDb.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
