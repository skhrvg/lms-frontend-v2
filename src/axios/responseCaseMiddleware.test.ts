import { describe, test, expect, vi } from 'vitest';
import responseCaseMiddleware from './responseCaseMiddleware';
import camelcaseKeys from 'camelcase-keys';
import { camelCase, snakeCase } from '@/mocks/case';

vi.mock('camelcase-keys');

const data = snakeCase;

describe('responseCaseMiddleware', () => {
  test('run camelcaseKeys when enabled', () => {
    (camelcaseKeys as ReturnType<typeof vi.fn>).mockReturnValue(camelCase);
    const result = responseCaseMiddleware(data, true);

    expect(camelcaseKeys).toHaveBeenCalledOnce();
    expect(camelcaseKeys).toHaveBeenCalledWith(data, { deep: true });
    expect(result).toStrictEqual(camelcaseKeys(data));
  });

  test('dont run camelcaseKeys when not enabled', () => {
    const result = responseCaseMiddleware(data, false);

    expect(camelcaseKeys).toHaveReturnedTimes(0);
    expect(result).toStrictEqual(data);
  });

  test('return data when enabled', () => {
    (camelcaseKeys as ReturnType<typeof vi.fn>).mockReturnValue(data);

    expect(responseCaseMiddleware(data, true)).toBe(data);
  });

  test('return data when not enabled', () => {
    expect(responseCaseMiddleware(data, false)).toBe(data);
  });
});
