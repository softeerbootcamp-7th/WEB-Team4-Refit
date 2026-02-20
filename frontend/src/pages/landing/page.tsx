import { Link, useNavigate } from 'react-router'

import {
  ArrowRightIcon,
  BookmarkIcon,
  CalendarStarIcon,
  CloudSaveIcon,
  Logo,
  MicIcon,
  NoteIcon,
  PencilChickIcon,
  SpeakingChickIcon,
} from '@/designs/assets'
import Button from '@/designs/components/button'
import { ROUTES } from '@/routes/routes'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-gray-white min-h-screen overflow-x-hidden">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px);   }
          50%       { transform: translateY(-14px); }
        }
        @keyframes floatY2 {
          0%, 100% { transform: translateY(0px);   }
          50%       { transform: translateY(-9px);  }
        }
        .anim-fade-up { opacity: 0; animation: fadeInUp 0.75s ease-out forwards; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.2s;  }
        .d3 { animation-delay: 0.35s; }
        .d4 { animation-delay: 0.5s;  }
        .d5 { animation-delay: 0.65s; }
        .float-slow { animation: floatY  4s   ease-in-out infinite;       }
        .float-med  { animation: floatY2 3.5s ease-in-out infinite 0.8s;  }
        .float-fast { animation: floatY  3s   ease-in-out infinite 1.5s;  }
        .feature-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .feature-card:hover {
          transform:  translateY(-5px);
          box-shadow: 0 20px 48px -12px rgba(254, 111, 15, 0.18);
        }
        .benefit-row { transition: background 0.2s ease; border-radius: 1rem; }
        .benefit-row:hover { background: var(--color-orange-050); }
      `}</style>

      {/* ─── Navbar ──────────────────────────────────────────────── */}
      <nav className="bg-gray-white fixed top-0 right-0 left-0 z-50 h-15 border-b border-gray-100">
        <div className="mx-auto flex h-full w-6xl items-center justify-between">
          <Logo className="h-6 w-auto text-orange-500" />
          <div className="flex items-center gap-2">
            <Button variant="fill-orange-500" size="xs" onClick={() => navigate(ROUTES.SIGNIN)}>
              시작하기
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-screen items-center pt-20"
        style={{ background: 'linear-gradient(145deg, #fdf1d7 0%, #fff0e7 45%, #ffffff 90%)' }}
      >
        {/* Background blobs */}
        <div className="pointer-events-none absolute top-28 right-0 h-96 w-96 rounded-full bg-orange-100 opacity-50 blur-3xl" />
        <div className="bg-orange-050 pointer-events-none absolute bottom-16 left-0 h-72 w-72 rounded-full opacity-80 blur-2xl" />

        <div className="relative mx-auto w-6xl py-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto]">
            {/* Left: Text */}
            <div className="flex max-w-xl flex-col gap-8">
              <div className="anim-fade-up d1 bg-gray-white inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 px-4 py-2 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                </span>
                <span className="caption-m-semibold text-orange-600">면접 회고 플랫폼 Refit</span>
              </div>

              <h1 className="anim-fade-up d2 flex flex-col" style={{ lineHeight: '1.25' }}>
                <span className="headline-l-bold text-gray-900">면접 후에도</span>
                <span className="headline-l-bold text-orange-500">성장은 계속됩니다</span>
              </h1>

              <p className="anim-fade-up d3 title-s-medium max-w-md text-gray-500" style={{ lineHeight: '1.75' }}>
                Refit으로 면접 답변을 녹음하고, KPT 회고를 통해
                <br />
                다음 면접을 더 자신있게 준비하세요.
              </p>

              <div className="anim-fade-up d4 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={ROUTES.SIGNIN}
                  className="body-m-bold text-gray-white inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-7 py-4 transition-all hover:bg-orange-600"
                  style={{ boxShadow: '0 8px 24px -4px rgba(254, 111, 15, 0.4)' }}
                >
                  무료로 시작하기
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <a
                  href="#features"
                  className="body-m-medium bg-gray-white inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-7 py-4 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
                >
                  더 알아보기
                </a>
              </div>

              <div className="anim-fade-up d5 flex items-center gap-8 pt-2">
                {[
                  { value: 'KPT', label: '회고 프레임워크' },
                  { value: '실시간', label: '음성→텍스트' },
                  { value: 'AI', label: '질문 추천' },
                ].map(({ value, label }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="title-l-bold text-orange-500">{value}</span>
                    <span className="caption-m-medium text-gray-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative hidden w-[340px] lg:block">
              {/* Floating card – recording */}
              <div className="float-fast border-gray-150 bg-gray-white absolute -top-6 -left-16 z-20 min-w-[160px] rounded-2xl border px-4 py-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="bg-red-050 flex h-8 w-8 items-center justify-center rounded-xl">
                      <MicIcon className="h-4 w-4 text-red-400" />
                    </div>
                    <span className="border-gray-white absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 bg-red-400" />
                  </div>
                  <div>
                    <p className="caption-m-semibold text-gray-900">녹음 중</p>
                    <p className="caption-m-medium text-gray-400">02:34</p>
                  </div>
                </div>
              </div>

              {/* Mascot */}
              <div className="float-slow flex items-center justify-center">
                <SpeakingChickIcon className="h-72 w-72" />
              </div>

              {/* Floating card – KPT done */}
              <div className="float-med border-gray-150 bg-gray-white absolute -right-12 -bottom-4 z-20 rounded-2xl border px-5 py-3.5 shadow-lg">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-050 flex h-5 w-5 items-center justify-center rounded-full">
                      <span className="caption-m-bold text-green-400">✓</span>
                    </div>
                    <p className="caption-m-semibold text-gray-900">KPT 회고 완료</p>
                  </div>
                  <div className="flex gap-1.5">
                    {[
                      { letter: 'K', bg: 'bg-green-050', text: 'text-green-400' },
                      { letter: 'P', bg: 'bg-red-050', text: 'text-red-400' },
                      { letter: 'T', bg: 'bg-blue-050', text: 'text-blue-400' },
                    ].map(({ letter, bg, text }) => (
                      <span
                        key={letter}
                        className={`caption-m-bold ${bg} ${text} flex h-7 w-7 items-center justify-center rounded-lg`}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────────────── */}
      <section id="features" className="bg-gray-white py-24">
        <div className="mx-auto w-6xl">
          <div className="mb-16 flex flex-col items-center gap-3 text-center">
            <span className="body-s-semibold bg-orange-050 rounded-full px-4 py-1.5 text-orange-500">핵심 기능</span>
            <h2 className="headline-m-bold text-gray-900">
              면접 회고의 모든 것,
              <br />
              Refit에서
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                Icon: MicIcon,
                title: '실시간 면접 녹음',
                description:
                  '면접 현장에서 실시간으로 답변을 기록하고 텍스트로 자동 변환합니다. 중요한 순간 하나도 놓치지 마세요.',
                iconBg: 'bg-orange-050',
                iconColor: 'text-orange-500',
                topBar: 'bg-orange-500',
              },
              {
                Icon: NoteIcon,
                title: 'KPT 프레임워크',
                description:
                  'Keep · Problem · Try 3단계로 체계적인 회고를 작성하세요. 면접의 강점과 약점을 명확히 파악할 수 있습니다.',
                iconBg: 'bg-blue-050',
                iconColor: 'text-blue-400',
                topBar: 'bg-blue-400',
              },
              {
                Icon: CalendarStarIcon,
                title: '성장 트래킹',
                description:
                  '면접 히스토리와 통계를 한눈에 확인하세요. 나의 성장 곡선을 시각적으로 추적하고 약점을 집중 보완하세요.',
                iconBg: 'bg-green-050',
                iconColor: 'text-green-400',
                topBar: 'bg-green-400',
              },
            ].map(({ Icon, title, description, iconBg, iconColor, topBar }) => (
              <div key={title} className="feature-card flex flex-col overflow-hidden rounded-3xl bg-gray-100">
                <div className={`h-1 ${topBar}`} />
                <div className="flex flex-col gap-6 p-8">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="title-m-bold text-gray-900">{title}</h3>
                    <p className="body-m-regular text-gray-500" style={{ lineHeight: '1.75' }}>
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────────── */}
      <section className="py-24" style={{ background: 'linear-gradient(160deg, #fdf1d7 0%, #fff0e7 100%)' }}>
        <div className="mx-auto w-6xl">
          <div className="mb-16 flex flex-col items-center gap-3 text-center">
            <span className="body-s-semibold bg-gray-white rounded-full border border-orange-200 px-4 py-1.5 text-orange-500 shadow-sm">
              시작 가이드
            </span>
            <h2 className="headline-m-bold text-gray-900">
              딱 3단계면
              <br />
              충분합니다
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                step: '01',
                Icon: MicIcon,
                title: '면접 녹음',
                description: '면접 유형과 회사를 등록하고, 면접 중 실시간으로 답변을 녹음하세요.',
              },
              {
                step: '02',
                Icon: NoteIcon,
                title: 'KPT 회고',
                description: '녹음된 내용을 바탕으로 잘한 점, 아쉬운 점, 개선할 점을 체계적으로 기록하세요.',
              },
              {
                step: '03',
                Icon: CalendarStarIcon,
                title: '성장 확인',
                description: '대시보드에서 성장 추이를 확인하고, 다음 면접을 더 자신감 있게 준비하세요.',
              },
            ].map(({ step, Icon, title, description }) => (
              <div key={step} className="bg-gray-white flex flex-col rounded-3xl p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-bold text-orange-100" style={{ fontSize: '40px', lineHeight: 1 }}>
                    {step}
                  </span>
                  <div className="bg-orange-050 flex h-11 w-11 items-center justify-center rounded-2xl">
                    <Icon className="h-5 w-5 text-orange-500" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="title-m-bold text-gray-900">{title}</h3>
                  <p className="body-s-regular text-gray-500" style={{ lineHeight: '1.75' }}>
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Benefits ────────────────────────────────────────────── */}
      <section className="bg-gray-white py-24">
        <div className="mx-auto w-6xl">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            {/* Text */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <span className="body-s-semibold bg-orange-050 w-fit rounded-full px-4 py-1.5 text-orange-500">
                  Refit만의 특별함
                </span>
                <h2 className="headline-m-bold text-gray-900">
                  더 스마트한
                  <br />
                  면접 준비
                </h2>
                <p className="body-l-regular text-gray-500" style={{ lineHeight: '1.75' }}>
                  단순한 기록을 넘어, 데이터 기반의 체계적인 면접 준비를 도와드립니다.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                {[
                  {
                    Icon: BookmarkIcon,
                    title: '어려운 질문 컬렉션',
                    description: '답변이 어려웠던 질문을 북마크하고 폴더로 관리하세요.',
                  },
                  {
                    Icon: CloudSaveIcon,
                    title: '자동 저장',
                    description: '작성 중인 내용이 실시간으로 자동 저장됩니다.',
                  },
                  {
                    Icon: CalendarStarIcon,
                    title: '맞춤 질문 추천',
                    description: '나의 직무와 면접 이력을 분석해 최신 트렌드 질문을 추천합니다.',
                  },
                ].map(({ Icon, title, description }) => (
                  <div key={title} className="benefit-row flex cursor-default items-start gap-4 px-4 py-4">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                      <Icon className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="body-l-semibold text-gray-900">{title}</h4>
                      <p className="body-m-regular text-gray-500">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mascot */}
            <div className="flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <div className="bg-orange-050 absolute h-72 w-72 rounded-full" />
                <div className="absolute h-52 w-52 rounded-full bg-orange-100 opacity-60" />
                <PencilChickIcon className="float-slow relative z-10 h-60 w-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-orange-500 py-28">
        <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-orange-400 opacity-40 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-orange-700 opacity-40 blur-2xl" />

        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 text-center">
          <div className="flex flex-col gap-4">
            <h2 className="headline-l-bold text-gray-white" style={{ lineHeight: '1.3' }}>
              지금 Refit을
              <br />
              시작해보세요
            </h2>
            <p className="title-s-medium text-orange-100">면접은 끝이 아니라 성장의 시작입니다.</p>
          </div>

          <Link
            to={ROUTES.SIGNIN}
            className="body-l-bold bg-gray-white hover:bg-orange-050 inline-flex items-center gap-2.5 rounded-2xl px-8 py-4 text-orange-500 transition-all"
            style={{ boxShadow: '0 8px 32px -8px rgba(0,0,0,0.3)' }}
          >
            Google로 무료 시작하기
            <ArrowRightIcon className="h-5 w-5" />
          </Link>

          <p className="caption-m-medium text-orange-200">회원가입 5초면 끝 · 신용카드 불필요</p>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-gray-900 py-8">
        <div className="mx-auto flex w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo className="h-5 w-auto text-gray-600" />
          <p className="caption-m-medium text-gray-600">© 2026 Refit. Softeer Team 4. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
