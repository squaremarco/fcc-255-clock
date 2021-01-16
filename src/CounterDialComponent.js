import { useCallback, useEffect, useState } from 'react';
import { BiCaretUp, BiCaretDown } from 'react-icons/bi';
import tw, { styled } from 'twin.macro';

import ButtonComponent from './ButtonComponent';

const CounterDialStyledComponent = styled.div`
  ${tw`flex flex-col items-center`}
`;

const CounterDialContentStyledComponent = styled.div`
  ${tw`flex justify-center items-center`}
`;

const CounterDialValueStyledComponent = styled.div`
  ${tw`mx-3 w-20 h-20 flex justify-center items-center text-2xl bg-green-200 rounded`}
`;

const CounterDialComponent = ({
  label,
  labelId,
  upButtonId,
  downButtonId,
  counterValueId,
  disableButtons,
  length = 0,
  onChange,
  ...props
}) => {
  const [counter, setCounter] = useState(length);

  useEffect(() => setCounter(length), [length]);

  const onClickHandler = useCallback(
    value => {
      const v = value < 1 ? 1 : value > 60 ? 60 : value;
      setCounter(v);
      onChange && onChange(v);
    },
    [onChange]
  );
  return (
    <CounterDialStyledComponent {...props}>
      <h1 id={labelId}>{label}</h1>
      <CounterDialContentStyledComponent>
        <ButtonComponent
          id={upButtonId}
          icon={BiCaretUp}
          onClick={() => onClickHandler(counter + 1)}
          disabled={disableButtons}
        />
        <CounterDialValueStyledComponent id={counterValueId}>{counter}</CounterDialValueStyledComponent>
        <ButtonComponent
          id={downButtonId}
          icon={BiCaretDown}
          onClick={() => onClickHandler(counter - 1)}
          disabled={disableButtons}
        />
      </CounterDialContentStyledComponent>
    </CounterDialStyledComponent>
  );
};

export default CounterDialComponent;
