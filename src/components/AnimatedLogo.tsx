/**
 * GSAP + @gsap/react: `useGSAP(fn, { scope: containerRef })` only scopes selectors like `.dot`
 * if you pass `ref={containerRef}` on a wrapper — otherwise `scope.current` is null and tweens no-op.
 * `repeat: -1` on a timeline = infinite loop (Flutter: repeat with no limit).
 */
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP);

interface AnimatedLogoProps {
  dotColor?: string;
}

function AnimatedLogo({ dotColor = 'bg-primary' }: AnimatedLogoProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1 });

      tl.to('.dot1', {
        x: 8,
        opacity: 0.9,
        duration: 0.3,
        ease: 'sine.out',
      })
        .to(
          '.dot2',
          {
            y: 8,
            opacity: 0.9,
            duration: 0.3,
            ease: 'sine.out',
          },
          0
        )
        .to(
          '.dot3',
          {
            x: -8,
            opacity: 0.9,
            duration: 0.3,
            ease: 'sine.out',
          },
          0
        )
        .to(
          '.dot4',
          {
            y: -8,
            opacity: 0.9,
            duration: 0.3,
            ease: 'sine.out',
          },
          0
        )
        .to('.dot1', {
          x: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'sine.inOut',
        })
        .to(
          '.dot2',
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: 'sine.inOut',
          },
          '<'
        )
        .to(
          '.dot3',
          {
            x: 0,
            opacity: 1,
            duration: 0.3,
            ease: 'sine.inOut',
          },
          '<'
        )
        .to(
          '.dot4',
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: 'sine.inOut',
          },
          '<'
        )
        .to({}, { duration: 30 }); // pause
    },
    { scope: container }
  );

  return (
    <div ref={container} className="relative h-3 w-3">
      <span className={'dot dot1 left-0 top-0 h-1 w-1 ' + dotColor} />
      <span className={'dot dot2 right-0 top-0 h-1 w-1 ' + dotColor} />
      <span className={'dot dot3 bottom-0 right-0 h-1 w-1 ' + dotColor} />
      <span className={'dot dot4 bottom-0 left-0 h-1 w-1 ' + dotColor} />
    </div>
  );
}

export default AnimatedLogo;
