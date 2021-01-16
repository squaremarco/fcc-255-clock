import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body, html {
    ${tw`h-full`}
  }

  h1 {
    ${tw`text-2xl mb-2`}
  }
`;

export default GlobalStyle;
