"use client"; // ← これを必
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';
import { ArrowDown } from 'lucide-react';

const MotionDiv = motion.div as any;
const MotionHeader = motion.header as any;

// --- Design Tokens ---
const COLORS = {
  bg: '#F2F0EC',       // Paper
  text: '#241D14',     // Dark Ink
  accent: '#A78F45',   // Antique Gold
  sub: '#A7ADBC',      // Concrete
};

// --- Data: Biography ---
const BIO_DATA = [
  {
    year: '2000 - 2018',
    title: 'Roots',
    desc: '福島県郡山市出身。小学校から大学まで、水泳、野球、ハンドボールと、常にスポーツに没頭。この経験からスタミナと忍耐力を獲得する。',
  },
  {
    year: '2019',
    title: 'Education',
    desc: '秋田県立大学 情報工学専攻。スマート農業の研究を通じ、デジタルの力が物理的な「現場」を変える面白さを体験。',
  },
  {
    year: '2020 - 2022',
    title: 'Startup Experience',
    desc: '仙台・株式会社スパークルでのインターンを経て、札幌・あるやうむに5人目のメンバーとして参画。日本初のふるさと納税NFTリリースに参画。',
  },
  {
    year: '2023 - 2025',
    title: 'Enterprise Architecture',
    desc: 'DXCテクノロジー・ジャパン入社。製薬会社のシステム開発に従事。アジャイルとは対極にある堅牢な開発プロセスと品質管理を2年半叩き込む。',
  },
  {
    year: '2025 - Present',
    title: 'Re-Join & Commitment',
    desc: 'あるやうむへ再ジョイン。大企業の知見をベンチャーのスピード感に還元し、地方創生の最前線へ。',
  },
];

// --- Data: Achievements ---
const ACHIEVEMENTS = [
  {
    category: 'Web Development',
    title: 'TOKKEN ポータルサイト開発PM',
    desc: '地域の隠れた資源を特別な体験や権利として販売をするプラットフォーム「TOKKEN（トッケン）」の開発の全体的なマネジメントを担当。',
    image: '/TOKKEN_col.png',
    link: 'https://tokken.alyawmu.com/'
  },
  {
    category: 'Web Development',
    title: 'ふるさと納税NFT LP開発',
    desc: '数年後に完成する新たなウィスキーをNFTとしてふるさと納税の返礼品を提供するLPサイトを開発。',
    image: '/whisky-furusato-nft.png',
    link: 'https://whisky.alyawmu.com/miyota-whisky-fans-f/'
  },
  {
    category: 'Automation (DX)',
    title: '業務の自動化(VoicyのNote記事、スカウトメール)',
    desc: 'あるやうむとして、2022年から配信してきたVoicyをテキスト情報として残すために音声コンテンツをNoteの記事として作成するフローを自動化。また、地域おこし協力隊DAOの候補者数百人へのスカウトメールの自動生成システムを構築。',
    image: '/voicy_note.png',
    link: 'https://note.com/alyawmu_voicy'
  },
  {
    category: 'Web media',
    title: '地方創生Web3研究所',
    desc: '日本全国のWeb3を活用した地方創生事例をブログの記事として作成。',
    image: '/web3_labo.png',
    link: 'https://alyawmu.com/laboratory/'
  },
];

const FIREFLY_COUNT = 15;
const FIREFLY_STYLES = Array.from({ length: FIREFLY_COUNT }, (_, i) => {
  const seed = i + 1;
  const mod = (n: number, m: number) => ((n % m) + m) % m;
  const pos = (n: number, m: number) => mod(n, m) - m / 2;
  const x1 = pos(seed * 37, 100);
  const y1 = pos(seed * 53, 100);
  const x2 = pos(seed * 67, 100);
  const y2 = pos(seed * 29, 100);
  const x3 = pos(seed * 83, 100);
  const y3 = pos(seed * 41, 100);
  const s1 = 0.4 + (mod(seed * 7, 60) / 100);
  const s2 = 0.6 + (mod(seed * 11, 50) / 100);
  const s3 = 0.5 + (mod(seed * 17, 45) / 100);
  const duration = 140 + mod(seed * 13, 80);
  const delay = -(mod(seed * 7, 60));
  const drift = 8 + mod(seed * 3, 10);
  const flash = 4 + mod(seed * 5, 8);
  return {
    "--x1": `${x1}vw`,
    "--y1": `${y1}vh`,
    "--x2": `${x2}vw`,
    "--y2": `${y2}vh`,
    "--x3": `${x3}vw`,
    "--y3": `${y3}vh`,
    "--s1": s1,
    "--s2": s2,
    "--s3": s3,
    "--move-duration": `${duration}s`,
    "--move-delay": `${delay}s`,
    "--drift-duration": `${drift}s`,
    "--flash-duration": `${flash}s`,
  } as React.CSSProperties;
});

// --- Components ---

// Section Wrapper
const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <section className={`px-2 md:px-3 lg:px-6 py-3 md:py-10 relative ${className}`}>
    {children}
  </section>
);

// Animated Text Reveal
const RevealText = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </MotionDiv>
);

export default function NakamuraPortfolio() {
  const heroImages = ["/hero01.jpeg", "/hero02.jpeg", "/hero03.jpeg", "/hero04.jpeg"];
  const bioSectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: bioScrollProgress } = useScroll({
    target: bioSectionRef,
    offset: ["start end", "start start"],
  });

  const bioContentOpacity = useTransform(bioScrollProgress, [0.55, 0.9], [0, 1]);
  const bioContentY = useTransform(bioScrollProgress, [0.55, 0.9], [24, 0]);

  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest: number) => {
      const vh = window.innerHeight;
      setIsHeaderVisible(latest > vh - 100);
    });
  }, [scrollY]);

  return (
    <ReactLenis root>
      <div
        className="min-h-screen font-serif selection:bg-[#A78F45] selection:text-white overflow-x-hidden"
        style={{ backgroundColor: COLORS.bg, color: COLORS.text, fontFamily: '"Shippori Mincho", serif' }}
      >

        {/* --- STICKY HEADER --- */}
        <MotionHeader
          className="fixed top-0 left-0 z-50 w-full p-4 md:p-4 bg-[#F2F0EC]/90 backdrop-blur-md border-b border-[#A7ADBC]/20 shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isHeaderVisible ? 1 : 0, y: isHeaderVisible ? 0 : -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-end gap-6">
            <div className="w-12 h-12 md:w-10 md:h-10 rounded-full border border-[#241D14]/60 rotate-[-18deg] relative bg-[#F2F0EC]">
              <div className="absolute left-2 top-5 md:left-2 md:top-4 w-8 md:w-6 h-[2px] bg-[#241D14]/70 rotate-[18deg]" />
              <div className="absolute left-4 top-7 md:left-4 md:top-6 w-6 md:w-4 h-[2px] bg-[#241D14]/70 rotate-[18deg]" />
            </div>
            <div className="tracking-[0.35em] text-[10px] md:text-xs font-semibold uppercase text-[#241D14]">
              Nakamura
              <span className="block tracking-[0.4em] text-[8px] md:text-[10px] text-[#6B6B6B] mt-1">
                Portfolio
              </span>
            </div>
          </div>
        </MotionHeader>

        {/* --- HERO SECTION --- */}
        <Section className="h-screen pt-2 md:pt-6 !fixed inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.08]">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(${COLORS.text} 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
              }}
            />
          </div>
          <div className="firefly-layer">
            {FIREFLY_STYLES.map((style, index) => (
              <span key={`firefly-${index}`} className="firefly" style={style} />
            ))}
          </div>

          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="relative z-10 grid min-h-[calc(100vh-4rem)] grid-cols-1 gap-8 md:h-[calc(100vh-4rem)] md:grid-cols-5 md:grid-rows-8 md:gap-6 items-stretch w-full"
          >
            <div className="md:col-start-1 md:col-end-4 md:row-start-1 md:row-end-3 md:w-5/6">
              <p className="text-left text-xs md:text-sm uppercase tracking-[0.35em] text-[#6B6B6B] mb-6">
                Portfolio
              </p>
              <p className="text-left text-xs md:text-lg font-bold leading-relaxed">
                Shape the contours of communities—through digital design.<br className="hidden lg:block" />
                Drawing on a decade of witnessing the post-disaster recovery, <br className="hidden lg:block" />I design and build systems that help local communities sustain<br className="hidden lg:block" />what they do—over the long term.
                I bring both the speed of startups and the rigor of enterprise development to every project.
              </p>
            </div>

            <div className="md:col-start-2 md:col-end-5 md:row-start-4 md:row-end-6 space-y-6 text-[8px] md:text-xs leading-loose text-[#4C4C4C] text-center">
              <RevealText delay={0.2}>
                <p>小学4年次に東日本大震災を経験。一度は誰もいなくなってしまった町が、</p>
                <p>昔の良さを残しつつ、昔よりもきれいで、住みやすいまちに再生していく様子を見て、建築学科を志す。</p>
              </RevealText>
              <RevealText delay={0.4}>
                <p>
                  一番好きな町は秋田県の秋田市亀の町。<br></br>デザインを通して地域の「内」と「外」をつなぐ町としての空間がとてもよい。<br></br>
                  私個人としては、いろいろあり大学では、情報学を専攻。<br></br>大学2年次からインターンを開始し、デジタル技術を活用した新しい地方創生を模索中。<br></br>
                </p>
              </RevealText>
            </div>

            <div className="md:col-start-1 md:col-end-3 md:row-start-7 md:row-end-9 flex items-end justify-end md:justify-start gap-6 w-full text-right md:text-left">
              <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border border-[#241D14]/60 rotate-[-18deg] relative">
                <div className="absolute left-2 top-5 w-8 h-[2px] md:left-3 md:top-7 md:w-12 md:h-[2px] bg-[#241D14]/70 rotate-[18deg]" />
                <div className="absolute left-4 top-7 w-6 h-[2px] md:left-6 md:top-10 md:w-10 md:h-[2px] bg-[#241D14]/70 rotate-[18deg]" />
              </div>
              <div className="tracking-[0.35em] text-xs md:text-base font-semibold uppercase">
                Nakamura
                <span className="block tracking-[0.4em] text-[10px] md:text-sm text-[#6B6B6B] mt-2">
                  Portfolio
                </span>
              </div>
            </div>

            <div className="mt-8 md:mt-0 md:col-start-5 md:col-end-6 md:row-start-5 md:row-end-9 md:self-stretch flex justify-center md:justify-start">
              <div
                className="hero-frame w-full max-w-[320px] md:max-w-none aspect-[3/4] md:aspect-auto md:h-full"
              >
                {heroImages.map((src, index) => (
                  <div
                    key={src}
                    className={`hero-slide hero-slide-${index + 1}`}
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(36,29,20,0.2), rgba(36,29,20,0.05)), url('${src}')`,
                    }}
                  />
                ))}
                <div className="hero-wipe" />
              </div>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3 text-[#6B6B6B]"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <ArrowDown size={16} className="animate-bounce" />
          </MotionDiv>
        </Section>

        <div className="relative z-10 mt-[100vh]">
          {/* --- BIOGRAPHY SECTION --- */}
          <Section className="border-t border-[#A7ADBC]/20 bg-[#F2F0EC]">
            <div ref={bioSectionRef} className="relative overflow-hidden">
              <MotionDiv style={{ opacity: bioContentOpacity, y: bioContentY }}>
                <RevealText>
                  <h2 className="text-3xl md:text-4xl font-bold mb-24 text-center tracking-widest">BIOGRAPHY</h2>
                </RevealText>

                <div className="relative max-w-4xl mx-auto">
                  {/* Center Line */}
                  <div className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-[1px] bg-[#A7ADBC]/50 md:-translate-x-1/2 origin-top transform" />

                  {/* Timeline Items */}
                  <div className="space-y-16 md:space-y-24">
                    {BIO_DATA.map((item, index) => (
                      <TimelineItem key={index} data={item} index={index} />
                    ))}
                  </div>
                </div>
              </MotionDiv>
            </div>
          </Section>

          {/* --- ACHIEVEMENTS SECTION --- */}
          <Section className="bg-[#F2F0EC] border-t border-[#A7ADBC]/20">
            <div className="max-w-6xl mx-auto">
              <RevealText>
                <h2 className="text-3xl md:text-4xl font-bold mb-16 tracking-widest">ACHIEVEMENTS</h2>
              </RevealText>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                {ACHIEVEMENTS.map((item, i) => (
                  <RevealText key={i} delay={i * 0.1}>
                    <div className="group border-t border-[#241D14] pt-6 hover:border-[#A78F45] transition-colors duration-500 cursor-default">
                      <p className="text-xs text-[#A7ADBC] mb-2 uppercase tracking-widest">{item.category}</p>
                      <h3 className="text-xl md:text-2xl font-bold mb-4 group-hover:text-[#A78F45] transition-colors duration-300">
                        {item.title}
                      </h3>

                      {/* Image Use Area */}
                      {item.image ? (
                        <div className="mb-4 w-full h-48 flex items-center justify-center">
                          {item.link ? (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="block h-full transition-opacity duration-300 hover:opacity-80">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="h-full w-auto object-contain"
                              />
                            </a>
                          ) : (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-auto object-contain"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="mb-4 w-full h-48 bg-gray-200 overflow-hidden relative flex items-center justify-center text-[#A7ADBC]/50">
                          <span className="text-xs uppercase tracking-widest">Coming Soon</span>
                        </div>
                      )}

                      <p className="text-sm md:text-base leading-relaxed text-gray-600">
                        {item.desc}
                      </p>
                    </div>
                  </RevealText>
                ))}
              </div>
            </div>
          </Section>

          {/* --- VISION SECTION --- */}
          <Section className="bg-[#241D14] text-[#F2F0EC]">
            <div className="max-w-4xl mx-auto text-center">
              <RevealText>
                <h2 className="text-[#A78F45] text-sm font-bold tracking-[0.2em] mb-8 uppercase">Future</h2>
              </RevealText>

              <RevealText delay={0.2}>
                <h3 className="text-3xl md:text-5xl font-bold leading-normal mb-12">
                  今後やってみたいこと
                </h3>
              </RevealText>

              <RevealText delay={0.4}>
                <p className="text-lg md:text-xl leading-loose text-[#A7ADBC] mb-16">
                  人口減少の中、地方を存続させることはとても難しいですが、<br />
                  自分の好きな地域で、好きなものの良さが残るような取り組みをしていきたいです。<br />
                  ・関係人口・ファン作り<br />
                  ・地域の眠る資源を商品化<br />
                  ・地域へのインバウンド<br />
                </p>
              </RevealText>

              <RevealText delay={0.6}>
                <button className="px-12 py-4 border border-[#A78F45] text-[#A78F45] hover:bg-[#A78F45] hover:text-[#241D14] transition-all duration-500 text-lg tracking-widest">
                  CONTACT
                </button>
              </RevealText>
            </div>
          </Section>

          {/* --- FOOTER --- */}
          <footer className="bg-[#241D14] text-[#A7ADBC] py-12 text-center border-t border-[#A78F45]/20">
            <p className="text-xs tracking-widest">© 2026 Nakamura Kazuki. All Rights Reserved.</p>
          </footer>
        </div>

      </div >

      <style jsx global>{`
        .hero-frame {
          position: relative;
        overflow: hidden;
        background: #f2f0ec;
        }

        .hero-slide {
          position: absolute;
        inset: -1px;
        background-size: 110% 110%;
        background-position: 50% 50%;
        opacity: 0;
        transform: translateX(12%);
        z-index: 1;
        animation-duration: 32s, 40s;
        animation-iteration-count: infinite, infinite;
        animation-timing-function: ease, linear;
        will-change: transform, opacity, background-position;
        }

        .hero-slide-1 {
          animation-name: heroSlide1, heroPan;
        }

        .hero-slide-2 {
          animation-name: heroSlide2, heroPan;
        }

        .hero-slide-3 {
          animation-name: heroSlide3, heroPan;
        }

        .hero-slide-4 {
          animation-name: heroSlide4, heroPan;
        }

        .hero-wipe {
          position: absolute;
        inset: -1px;
        background: #F2F0EC;
        transform: scaleX(0);
        transform-origin: right center;
        animation: heroWipe 8s infinite linear;
        z-index: 2;
        }

        @keyframes heroWipe {
          0% {
            transform: scaleX(0);
          }
          87.5% {
          transform: scaleX(1);
          }
        100% {
          transform: scaleX(1);
          }
        }

        @keyframes heroPan {
          0% {
            background-position: 70% 50%;
          }
        100% {
          background-position: 30% 50%;
          }
        }

        @keyframes heroSlide1 {
          0% {
            opacity: 0;
            transform: translateX(12%);
          }
          3% {
          opacity: 1;
        transform: translateX(0);
          }
        21.875% {
          opacity: 1;
        transform: translateX(0);
          }
        25% {
          opacity: 0;
        transform: translateX(0);
          }
        100% {
          opacity: 0;
        transform: translateX(0);
          }
        }

        @keyframes heroSlide2 {
          0%,
          25% {
            opacity: 0;
            transform: translateX(12%);
          }
          28% {
          opacity: 1;
        transform: translateX(0);
          }
        46.875% {
          opacity: 1;
        transform: translateX(0);
          }
        50% {
          opacity: 0;
        transform: translateX(0);
          }
        100% {
          opacity: 0;
        transform: translateX(0);
          }
        }

        @keyframes heroSlide3 {
          0%,
          50% {
            opacity: 0;
            transform: translateX(12%);
          }
          53% {
          opacity: 1;
        transform: translateX(0);
          }
        71.875% {
          opacity: 1;
        transform: translateX(0);
          }
        75% {
          opacity: 0;
        transform: translateX(0);
          }
        100% {
          opacity: 0;
        transform: translateX(0);
          }
        }

        @keyframes heroSlide4 {
          0%,
          75% {
            opacity: 0;
            transform: translateX(12%);
          }
          78% {
          opacity: 1;
        transform: translateX(0);
          }
        96.875% {
          opacity: 1;
        transform: translateX(0);
          }
        100% {
          opacity: 0;
        transform: translateX(0);
          }
        }
      `}</style>
    </ReactLenis >
  );
}

// --- Sub Component: Timeline Item ---
function TimelineItem({ data, index }: { data: { year: string; title: string; desc: string }, index: number }) {
  const isEven = index % 2 === 0;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center w-full pl-10 md:pl-0"
    >
      {/* Time (Desktop Left) */}
      <div className={`md:w-[45%] mb-2 md:mb-0 md:text-right md:pr-12`}>
        <span className="text-[#A78F45] font-bold text-xl md:text-2xl font-serif tracking-widest block">
          {data.year}
        </span>
      </div>

      {/* Center Node */}
      <div className="absolute left-[13px] top-[6px] md:top-auto md:left-1/2 md:-translate-x-1/2 w-[10px] h-[10px] rounded-full bg-[#F2F0EC] border-2 border-[#A78F45] z-10" />

      {/* Content (Desktop Right) */}
      <div className={`md:w-[45%] md:pl-12`}>
        <h3 className="text-lg md:text-xl font-bold mb-2">{data.title}</h3>
        <p className="text-sm md:text-base leading-relaxed text-gray-600">
          {data.desc}
        </p>
      </div>
    </MotionDiv>
  );
}
