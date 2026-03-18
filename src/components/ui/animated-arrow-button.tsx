import React from 'react';

interface Button04Props {
  text: string;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}

export const Button04 = ({ text = "Nothing-Plop", onClick, isActive, className = "" }: Button04Props) => {
  // Define dot indices for the two icon variations
  const firstIconDots = [0, 2, 2, 1, 2, 0, 1, 1, 2, 2, 0, 1, 0, 2, 2, 1, 0, 2, 2, 2, 2, 0, 1, 0, 2];
  const secondIconDots = [0, 2, 2, 1, 2, 0, 1, 1, 2];

  return (
    <>
      <style>{`
        .button04 {
          --ui-icon-size: 1.5rem;
          --ui-icon-color: #94a3b8;
          --ui-icon-color-active: #8b5cf6;
          --ui-dot-size: 2px;
          --ui-dot-gap: 3px;
          
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 2.5rem;
          padding: 0.625rem 1rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          font-weight: 600;
          font-size: 0.8125rem;
          line-height: 1;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          text-decoration: none;
        }

        .button04.is-active {
          background: rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.4);
          color: #fff;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);
        }

        .button04:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          color: #fff;
          transform: translateY(-1px);
        }

        .button04_inner {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          z-index: 1;
        }

        .button04_icon-wrap {
          position: relative;
          width: var(--ui-icon-size);
          height: var(--ui-icon-size);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .button04_icon {
          position: absolute;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: var(--ui-dot-gap);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
        }

        .button04_icon.is-arrow {
          grid-template-columns: repeat(3, 1fr);
          opacity: 0;
          transform: translateX(-10px);
        }

        .button04:hover .button04_icon:not(.is-arrow) {
          opacity: 0;
          transform: translateX(10px);
        }

        .button04:hover .button04_icon.is-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .button04.is-active .button04_icon-wrap {
          color: var(--ui-icon-color-active);
        }

        .button04_dot {
          width: var(--ui-dot-size);
          height: var(--ui-dot-size);
          background-color: currentColor;
          border-radius: 50%;
          opacity: calc(0.3 + (var(--index) * 0.35));
        }

        .button04_bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .button04:hover .button04_bg {
          transform: translateX(100%);
        }
      `}</style>
      <a 
        href="#" 
        className={`button04 ${isActive ? 'is-active' : ''} ${className}`} 
        onClick={(e) => {
          e.preventDefault();
          onClick?.();
        }}
      >
        <span className="button04_bg"></span>
        <span data-text={text} className="button04_inner">
          <span className="button04_text">{text}</span>
          <span className="button04_icon-wrap">
            <span 
              style={{ '--index-parent': 0 } as React.CSSProperties} 
              className="button04_icon"
            >
              {firstIconDots.map((index, i) => (
                <span
                  key={`first-dot-${i}`}
                  style={{ '--index': index }as React.CSSProperties}
                  className="button04_dot"
                ></span>
              ))}
            </span>
            <span 
              style={{ '--index-parent': 1 }as React.CSSProperties} 
              className="button04_icon is-arrow"
            >
              {secondIconDots.map((index, i) => (
                <span
                  key={`second-dot-${i}`}
                  style={{ '--index': index }as React.CSSProperties}
                  className="button04_dot"
                ></span>
              ))}
            </span>
          </span>
        </span>
      </a>
    </>
  );
};
