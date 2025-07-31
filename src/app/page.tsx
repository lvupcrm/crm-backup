import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fitness CRM
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            피트니스 센터 고객 관리 시스템
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {/* 고객 관리 */}
            <Link 
              href="/customers/consultation" 
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">고객 관리</h3>
                <p className="text-gray-600 text-sm">상담, 등록 고객 관리</p>
              </div>
            </Link>

            {/* 상품 관리 */}
            <Link 
              href="/products" 
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">💪</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">상품 관리</h3>
                <p className="text-gray-600 text-sm">회원권, PT 상품 관리</p>
              </div>
            </Link>

            {/* 메시지 관리 */}
            <Link 
              href="/messages/templates" 
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">메시지 관리</h3>
                <p className="text-gray-600 text-sm">알림톡, 캠페인 관리</p>
              </div>
            </Link>

            {/* 통계 */}
            <Link 
              href="/statistics" 
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">통계</h3>
                <p className="text-gray-600 text-sm">매출, 고객 분석</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            SuperClaude 프레임워크로 구축된 현대적인 CRM 시스템
          </p>
        </div>
      </div>
    </div>
  );
}
