import styled from 'styled-components';

interface ActionButtonProps {
  $variant?: 'primary' | 'secondary' | 'success' | 'warning';
  disabled?: boolean;
}

export const ActionButton = styled.button<ActionButtonProps>`
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${props => (props.disabled ? 0.6 : 1)};
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        `;
      case 'success':
        return `
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
        `;
      case 'warning':
        return `
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(250, 112, 154, 0.3);
        `;
      default:
        return `
          background: #f8f9fa;
          color: #495057;
          border: 2px solid #e9ecef;
        `;
    }
  }}

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => (!props.disabled ? '0 8px 25px rgba(0, 0, 0, 0.15)' : 'none')};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  &:hover:not(:disabled)::before {
    left: 100%;
  }
`;
