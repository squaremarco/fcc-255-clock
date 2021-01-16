import tw, { styled } from 'twin.macro';

const ButtonStyledComponent = styled.button`
  ${tw`m-2 p-3 bg-green-400 rounded text-green-50`}

  &:hover {
    ${tw`bg-green-300`}
  }

  &:active {
    ${tw`bg-green-500`}
  }

  &:disabled {
    ${tw`opacity-75 cursor-not-allowed`}
  }
`;

const ButtonComponent = ({ icon: Icon, ...props }) => (
  <ButtonStyledComponent {...props}>
    <Icon />
  </ButtonStyledComponent>
);

export default ButtonComponent;
