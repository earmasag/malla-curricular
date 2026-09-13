import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Cargando malla...'
}) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-(--bg-app) select-none transition-colors duration-300">
      <style>{`
        .pl {
          --pl-size: 5rem;
          aspect-ratio: 1;
          display: grid;
          gap: calc(var(--pl-size) * 0.125);
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          width: var(--pl-size);
          height: var(--pl-size);
        }

        .pl__dot {
          position: relative;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .pl__dot::before,
        .pl__dot::after {
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          aspect-ratio: 1;
          background-color: var(--pl-neutral-dot, #94a3b8);
          border-radius: 50%;
          content: "";
          display: block;
          position: absolute;
          width: 100%;
          transition: background-color 0.3s;
        }

        :root {
          --pl-neutral-dot: #94a3b8;
        }

        :root.dark, .dark {
          --pl-neutral-dot: #64748b;
        }

        .pl__dot::after {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
        }

        .pl__dot--sm::after {
          width: 167%;
        }

        .pl__dot--lg::after {
          width: 500%;
        }

        .pl__dot--red::before,
        .pl__dot--red::after {
          background-color: hsl(0 90% 60%);
        }

        .pl__dot--yellow::before,
        .pl__dot--yellow::after {
          background-color: hsl(45 90% 50%);
        }

        .pl__dot--green::before,
        .pl__dot--green::after {
          background-color: hsl(150 90% 40%);
        }

        .pl__dot--blue::before,
        .pl__dot--blue::after {
          background-color: hsl(210 90% 50%);
        }

        .pl__dot:nth-child(1)::before {
          animation-name: dot-scale1;
        }

        .pl__dot:nth-child(2) {
          animation-name: dot-rotate;
          transform-origin: 50% 200%;
        }
        .pl__dot:nth-child(2)::before {
          animation-name: dot-scale2;
        }

        .pl__dot:nth-child(3)::before {
          animation-name: dot-scale3;
        }
        .pl__dot:nth-child(3)::after {
          animation-name: dot-wave3;
        }

        .pl__dot:nth-child(4) {
          animation-name: dot-rotate;
          transform-origin: 200% 50%;
        }
        .pl__dot:nth-child(4)::before {
          animation-name: dot-scale4;
        }

        .pl__dot:nth-child(5)::before {
          animation-name: dot-scale5;
        }
        .pl__dot:nth-child(5)::after {
          animation-name: dot-wave5a, dot-wave5b;
        }

        .pl__dot:nth-child(6) {
          animation-name: dot-rotate;
          transform-origin: -100% 50%;
        }
        .pl__dot:nth-child(6)::before {
          animation-name: dot-scale6;
        }

        .pl__dot:nth-child(7)::before {
          animation-name: dot-scale7;
        }
        .pl__dot:nth-child(7)::after {
          animation-name: dot-wave7;
        }

        .pl__dot:nth-child(8) {
          animation-name: dot-rotate;
          transform-origin: 50% -100%;
        }
        .pl__dot:nth-child(8)::before {
          animation-name: dot-scale8;
        }

        .pl__dot:nth-child(9)::before {
          animation-name: dot-scale9;
        }
        .pl__dot:nth-child(9)::after {
          animation-name: dot-wave9;
        }

        @keyframes dot-rotate {
          from, 22% {
            animation-timing-function: ease-out;
            transform: rotate(-45deg);
          }
          37%, to {
            transform: rotate(0);
          }
        }

        @keyframes dot-scale1 {
          from, 36% { transform: translate(0, 0) scale(0); }
          50%, 71% { transform: translate(0, 0) scale(1); }
          87%, to { transform: translate(75%, 75%) scale(0); }
        }

        @keyframes dot-scale2 {
          from, 25% {
            animation-timing-function: ease-out;
            transform: translate(0, 0) scale(0);
          }
          40%, 71% { transform: translate(0, 0) scale(1); }
          87%, to { transform: translate(0, -100%) scale(0); }
        }

        @keyframes dot-scale3 {
          from, 27% {
            animation-timing-function: ease-in;
            transform: translate(0, 0) scale(0);
          }
          45%, 71% { transform: translate(0, 0) scale(1); }
          87%, to { transform: translate(-75%, 75%) scale(0); }
        }

        @keyframes dot-scale4 {
          from, 28% {
            animation-timing-function: ease-out;
            transform: translate(0, 0) scale(0);
          }
          43%, 71% { transform: translate(0, 0) scale(1); }
          87%, to { transform: translate(-100%, 0) scale(0); }
        }

        @keyframes dot-scale5 {
          from, 9%, to { transform: scale(0); }
          26% { transform: scale(1.17); }
          41%, 75% { transform: scale(1); }
        }

        @keyframes dot-scale6 {
          from, 22% {
            animation-timing-function: ease-out;
            transform: translate(0, 0) scale(0);
          }
          37%, 71% { transform: translate(0, 0) scale(1); }
          87%, to { transform: translate(100%, 0) scale(0); }
        }

        @keyframes dot-scale7 {
          from, 36% {
            animation-timing-function: ease-in;
            transform: translate(0, 0) scale(0);
          }
          53%, 71% { transform: translate(0, 0) scale(1); }
          87%, to { transform: translate(75%, -75%) scale(0); }
        }

        @keyframes dot-scale8 {
          from, 24% {
            animation-timing-function: ease-out;
            transform: translate(0, 0) scale(0);
          }
          39%, 71% { transform: translate(0, 0) scale(1); }
          87%, to { transform: translate(0, 100%) scale(0); }
        }

        @keyframes dot-scale9 {
          from, 32% {
            animation-timing-function: ease-in;
            transform: translate(0, 0) scale(0);
          }
          49%, 71% { transform: translate(0, 0) scale(1); }
          87%, to { transform: translate(-75%, -75%) scale(0); }
        }

        @keyframes dot-wave3 {
          from { visibility: hidden; }
          45% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(calc(1 / 1.67));
            visibility: hidden;
          }
          61%, to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes dot-wave5a {
          from { transform: translate(-50%, -50%) scale(0.2); }
          8% { transform: translate(-50%, -50%) scale(0.8); }
          25%, to { transform: translate(-50%, -50%) scale(1); }
        }

        @keyframes dot-wave5b {
          from, 25%, to { opacity: 0; }
          8% { opacity: 0.5; }
        }

        @keyframes dot-wave7 {
          from { visibility: hidden; }
          53% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(calc(1 / 1.67));
            visibility: hidden;
          }
          69%, to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes dot-wave9 {
          from { visibility: hidden; }
          49% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(calc(1 / 1.67));
            visibility: hidden;
          }
          65%, to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>

      <div className="pl" aria-label="Cargando">
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot pl__dot--red pl__dot--sm" />
        <div className="pl__dot" />
        <div className="pl__dot pl__dot--yellow pl__dot--lg" />
        <div className="pl__dot" />
        <div className="pl__dot pl__dot--blue pl__dot--sm" />
        <div className="pl__dot" />
        <div className="pl__dot pl__dot--green pl__dot--sm" />
      </div>

      {message && (
        <p
          className="mt-8 text-xs font-bold tracking-widest uppercase text-theme-600 dark:text-theme-200 animate-pulse"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          {message}
        </p>
      )}
    </div>
  );
};
