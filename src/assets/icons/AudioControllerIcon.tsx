import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const AudioControlIcon = React.memo(
  (props: { [key: string]: any; color?: string }) => {
    return (
      <Svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={props.color ? props.color : 'currentColor'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <Path d="M9 17H5a2 2 0 00-2 2 2 2 0 002 2h2a2 2 0 002-2zm12-2h-4a2 2 0 00-2 2 2 2 0 002 2h2a2 2 0 002-2z" />
        <Path d="M9 17L9 5 21 3 21 15" />
      </Svg>
    );
  },
);

export { AudioControlIcon };
