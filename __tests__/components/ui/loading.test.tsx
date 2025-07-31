import { render, screen } from '@testing-library/react';
import { 
  Loading, 
  PageLoading, 
  TableLoading, 
  ButtonLoading, 
  Skeleton, 
  TableSkeleton, 
  CardSkeleton 
} from '@/components/ui/loading';

describe('Loading Components', () => {
  describe('Loading', () => {
    it('기본 로딩 스피너를 렌더링한다', () => {
      render(<Loading />);
      
      const spinner = screen.getByRole('img', { hidden: true }); // Lucide icons have role="img"
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('텍스트와 함께 렌더링한다', () => {
      render(<Loading text="로딩 중..." />);
      
      expect(screen.getByText('로딩 중...')).toBeInTheDocument();
    });

    it('크기 옵션이 올바르게 적용된다', () => {
      const { rerender } = render(<Loading size="sm" />);
      let spinner = screen.getByRole('img', { hidden: true });
      expect(spinner).toHaveClass('w-4', 'h-4');

      rerender(<Loading size="lg" />);
      spinner = screen.getByRole('img', { hidden: true });
      expect(spinner).toHaveClass('w-12', 'h-12');
    });

    it('커스텀 클래스명이 적용된다', () => {
      render(<Loading className="custom-class" />);
      
      const container = screen.getByRole('img', { hidden: true }).parentElement;
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('PageLoading', () => {
    it('페이지 로딩 컴포넌트를 렌더링한다', () => {
      render(<PageLoading />);
      
      expect(screen.getByText('페이지를 불러오는 중...')).toBeInTheDocument();
      const container = screen.getByText('페이지를 불러오는 중...').parentElement?.parentElement;
      expect(container).toHaveClass('min-h-[400px]');
    });
  });

  describe('TableLoading', () => {
    it('테이블 로딩 컴포넌트를 렌더링한다', () => {
      render(<TableLoading />);
      
      expect(screen.getByText('데이터를 불러오는 중...')).toBeInTheDocument();
    });
  });

  describe('ButtonLoading', () => {
    it('버튼 로딩 컴포넌트를 렌더링한다', () => {
      render(<ButtonLoading>저장 중...</ButtonLoading>);
      
      expect(screen.getByText('저장 중...')).toBeInTheDocument();
      const spinner = screen.getByRole('img', { hidden: true });
      expect(spinner).toHaveClass('animate-spin');
    });
  });

  describe('Skeleton', () => {
    it('스켈레톤 컴포넌트를 렌더링한다', () => {
      render(<Skeleton />);
      
      const skeleton = document.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('bg-gray-200', 'rounded-md');
    });

    it('커스텀 클래스명이 적용된다', () => {
      render(<Skeleton className="h-10 w-full" />);
      
      const skeleton = document.querySelector('.animate-pulse');
      expect(skeleton).toHaveClass('h-10', 'w-full');
    });
  });

  describe('TableSkeleton', () => {
    it('테이블 스켈레톤을 기본 설정으로 렌더링한다', () => {
      render(<TableSkeleton />);
      
      const skeletons = document.querySelectorAll('.animate-pulse');
      // 헤더(4개) + 데이터행(5행 * 4열 = 20개) = 24개
      expect(skeletons).toHaveLength(24);
    });

    it('커스텀 행과 열 수로 렌더링한다', () => {
      render(<TableSkeleton rows={3} cols={5} />);
      
      const skeletons = document.querySelectorAll('.animate-pulse');
      // 헤더(5개) + 데이터행(3행 * 5열 = 15개) = 20개
      expect(skeletons).toHaveLength(20);
    });
  });

  describe('CardSkeleton', () => {
    it('카드 스켈레톤을 렌더링한다', () => {
      render(<CardSkeleton />);
      
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
      
      const container = document.querySelector('.border.rounded-lg');
      expect(container).toBeInTheDocument();
    });
  });
});