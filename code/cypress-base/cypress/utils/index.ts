/**
 * @author hangboss1761
 * @date 2022/08/28
 * @Description: 工具函数
 */

import { Random } from 'mockjs';

export const generateRandomWords = (count: number) => {
  return Random.word(count);
};
