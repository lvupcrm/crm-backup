import {
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatPhoneNumber,
  formatFileSize,
  truncateText,
  highlightText,
  debounce,
  throttle,
  generateColorFromString,
  getInitials,
  chunk,
  deepClone,
  removeEmptyValues,
  createSearchParams,
  storage,
  measurePerformance,
} from '@/lib/utils';

// localStorage 모킹
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('formatDate', () => {
    const testDate = new Date('2024-01-15T10:30:00');

    it('short 형식으로 날짜를 포맷한다', () => {
      const result = formatDate(testDate, 'short');
      expect(result).toBe('2024. 01. 15.');
    });

    it('long 형식으로 날짜를 포맷한다', () => {
      const result = formatDate(testDate, 'long');
      expect(result).toContain('2024년');
      expect(result).toContain('1월');
      expect(result).toContain('15일');
    });

    it('datetime 형식으로 날짜를 포맷한다', () => {
      const result = formatDate(testDate, 'datetime');
      expect(result).toContain('2024. 01. 15.');
      expect(result).toContain('10:30');
    });

    it('문자열 날짜를 처리한다', () => {
      const result = formatDate('2024-01-15', 'short');
      expect(result).toBe('2024. 01. 15.');
    });

    it('잘못된 날짜를 처리한다', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('유효하지 않은 날짜');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('방금 전을 올바르게 표시한다', () => {
      const date = new Date('2024-01-15T11:59:30');
      expect(formatRelativeTime(date)).toBe('방금 전');
    });

    it('분 전을 올바르게 표시한다', () => {
      const date = new Date('2024-01-15T11:45:00');
      expect(formatRelativeTime(date)).toBe('15분 전');
    });

    it('시간 전을 올바르게 표시한다', () => {
      const date = new Date('2024-01-15T10:00:00');
      expect(formatRelativeTime(date)).toBe('2시간 전');
    });

    it('일 전을 올바르게 표시한다', () => {
      const date = new Date('2024-01-13T12:00:00');
      expect(formatRelativeTime(date)).toBe('2일 전');
    });

    it('오래된 날짜는 short 형식으로 표시한다', () => {
      const date = new Date('2023-01-15T12:00:00');
      expect(formatRelativeTime(date)).toBe('2023. 01. 15.');
    });
  });

  describe('formatNumber', () => {
    it('화폐 형식으로 포맷한다', () => {
      const result = formatNumber(1234567, 'currency');
      expect(result).toContain('1,234,567');
      expect(result).toContain('₩');
    });

    it('소수점 형식으로 포맷한다', () => {
      const result = formatNumber(1234.56, 'decimal');
      expect(result).toBe('1,234.56');
    });

    it('퍼센트 형식으로 포맷한다', () => {
      const result = formatNumber(0.1234, 'percent');
      expect(result).toContain('12.3%');
    });
  });

  describe('formatPhoneNumber', () => {
    it('휴대폰 번호를 포맷한다', () => {
      expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678');
    });

    it('일반 전화번호를 포맷한다', () => {
      expect(formatPhoneNumber('0212345678')).toBe('02-1234-5678');
    });

    it('포맷할 수 없는 번호는 원본을 반환한다', () => {
      expect(formatPhoneNumber('123')).toBe('123');
    });

    it('이미 포맷된 번호의 숫자만 추출하여 포맷한다', () => {
      expect(formatPhoneNumber('010-1234-5678')).toBe('010-1234-5678');
    });
  });

  describe('formatFileSize', () => {
    it('바이트를 올바르게 포맷한다', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('소수점이 있는 파일 크기를 포맷한다', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });
  });

  describe('truncateText', () => {
    it('짧은 텍스트는 그대로 반환한다', () => {
      expect(truncateText('짧은 텍스트')).toBe('짧은 텍스트');
    });

    it('긴 텍스트를 자른다', () => {
      const longText = 'a'.repeat(100);
      const result = truncateText(longText, 50);
      expect(result).toBe('a'.repeat(50) + '...');
    });

    it('커스텀 길이로 자른다', () => {
      const result = truncateText('123456789', 5);
      expect(result).toBe('12345...');
    });
  });

  describe('highlightText', () => {
    it('검색어를 하이라이트한다', () => {
      const result = highlightText('Hello world', 'world');
      expect(result).toBe('Hello <mark class="bg-yellow-200">world</mark>');
    });

    it('대소문자를 구분하지 않는다', () => {
      const result = highlightText('Hello World', 'world');
      expect(result).toBe('Hello <mark class="bg-yellow-200">World</mark>');
    });

    it('검색어가 없으면 원본을 반환한다', () => {
      const result = highlightText('Hello world', '');
      expect(result).toBe('Hello world');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('지정된 시간 후에 함수를 호출한다', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('연속 호출 시 마지막 호출만 실행한다', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    jest.useFakeTimers();

    it('지정된 시간 간격으로 함수를 호출한다', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      throttledFn(); // 무시됨
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('generateColorFromString', () => {
    it('문자열에서 일관된 색상을 생성한다', () => {
      const color1 = generateColorFromString('test');
      const color2 = generateColorFromString('test');
      expect(color1).toBe(color2);
    });

    it('HSL 형식의 색상을 반환한다', () => {
      const color = generateColorFromString('test');
      expect(color).toMatch(/^hsl\(\d+, 70%, 50%\)$/);
    });
  });

  describe('getInitials', () => {
    it('이름에서 이니셜을 추출한다', () => {
      expect(getInitials('김철수')).toBe('김철');
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('김')).toBe('김');
    });

    it('최대 2글자까지만 반환한다', () => {
      expect(getInitials('김 철 수 영')).toBe('김철');
    });
  });

  describe('chunk', () => {
    it('배열을 지정된 크기로 나눈다', () => {
      const array = [1, 2, 3, 4, 5, 6, 7];
      const result = chunk(array, 3);
      expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });

    it('빈 배열을 처리한다', () => {
      expect(chunk([], 3)).toEqual([]);
    });
  });

  describe('deepClone', () => {
    it('객체를 깊은 복사한다', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);
      
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    it('배열을 깊은 복사한다', () => {
      const arr = [1, [2, 3], { a: 4 }];
      const cloned = deepClone(arr);
      
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
    });

    it('날짜 객체를 복사한다', () => {
      const date = new Date();
      const cloned = deepClone(date);
      
      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
    });

    it('원시 값을 그대로 반환한다', () => {
      expect(deepClone(1)).toBe(1);
      expect(deepClone('test')).toBe('test');
      expect(deepClone(null)).toBe(null);
    });
  });

  describe('removeEmptyValues', () => {
    it('빈 값들을 제거한다', () => {
      const obj = {
        a: 1,
        b: '',
        c: null,
        d: undefined,
        e: 'test',
      };
      
      const result = removeEmptyValues(obj);
      expect(result).toEqual({ a: 1, e: 'test' });
    });
  });

  describe('createSearchParams', () => {
    it('객체를 쿼리 파라미터로 변환한다', () => {
      const params = { name: 'test', age: 25 };
      const result = createSearchParams(params);
      expect(result).toBe('name=test&age=25');
    });

    it('배열 값을 처리한다', () => {
      const params = { tags: ['tag1', 'tag2'] };
      const result = createSearchParams(params);
      expect(result).toBe('tags=tag1&tags=tag2');
    });

    it('빈 값을 제거한다', () => {
      const params = { name: 'test', empty: '' };
      const result = createSearchParams(params);
      expect(result).toBe('name=test');
    });
  });

  describe('storage', () => {
    afterEach(() => {
      localStorageMock.getItem.mockClear();
      localStorageMock.setItem.mockClear();
      localStorageMock.removeItem.mockClear();
      localStorageMock.clear.mockClear();
    });

    describe('get', () => {
      it('값을 가져온다', () => {
        localStorageMock.getItem.mockReturnValue('{"test": "value"}');
        
        const result = storage.get('key');
        expect(result).toEqual({ test: 'value' });
        expect(localStorageMock.getItem).toHaveBeenCalledWith('key');
      });

      it('값이 없으면 기본값을 반환한다', () => {
        localStorageMock.getItem.mockReturnValue(null);
        
        const result = storage.get('key', 'default');
        expect(result).toBe('default');
      });

      it('파싱 오류 시 기본값을 반환한다', () => {
        localStorageMock.getItem.mockReturnValue('invalid json');
        
        const result = storage.get('key', 'default');
        expect(result).toBe('default');
      });
    });

    describe('set', () => {
      it('값을 저장한다', () => {
        storage.set('key', { test: 'value' });
        
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'key',
          '{"test":"value"}'
        );
      });
    });

    describe('remove', () => {
      it('값을 제거한다', () => {
        storage.remove('key');
        
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('key');
      });
    });

    describe('clear', () => {
      it('모든 값을 제거한다', () => {
        storage.clear();
        
        expect(localStorageMock.clear).toHaveBeenCalled();
      });
    });
  });

  describe('measurePerformance', () => {
    it('함수 실행 시간을 측정한다', () => {
      const mockFn = jest.fn(() => 'result');
      
      const result = measurePerformance(mockFn, 'test');
      
      expect(result.result).toBe('result');
      expect(typeof result.duration).toBe('number');
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('레이블 없이도 작동한다', () => {
      const mockFn = jest.fn(() => 'result');
      
      const result = measurePerformance(mockFn);
      
      expect(result.result).toBe('result');
      expect(typeof result.duration).toBe('number');
    });
  });
});