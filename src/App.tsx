/* eslint-disable @typescript-eslint/no-use-before-define */

import { animated } from "@react-spring/web";
import {
  useInteraction,
  useSwitch,
  usePopAnimation,
  useTransition
} from "./patches";

import styled from "styled-components";

export default function App() {
  return (
    <Page>
      <h1>Origami for React</h1>
      {/* <h2>Getting started</h2> */}
      <DemoGettingStarted />
    </Page>
  );
}

const Page = styled.div`
  padding: 1rem;
  font-family: system-ui;
`;

function DemoGettingStarted() {
  const { bind, tap } = useInteraction();
  const on = useSwitch(tap);
  const animation = usePopAnimation(on);
  const scale = useTransition(animation, [0.38, 1]);
  const opacity = useTransition(animation, [0, 1]);
  const background = useTransition(animation, ["white", "black"]);
  return (
    <Screen {...bind()} style={{ background }}>
      <Centered>
        <Image
          src="https://www.mymove.com/wp-content/uploads/2020/03/Dallas-skyline.jpg"
          style={{
            scale
          }}
          draggable={false} /* prevent default html drag drop */
        />
      </Centered>
      <Caption style={{ opacity }}>
        <CaptionLarge>Riverside Skyline</CaptionLarge>
        <p>Dallas, TX</p>
      </Caption>
    </Screen>
  );
}

const Image = styled(animated.img)`
  display: block;
`;

const Centered = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const CaptionLarge = styled.strong`
  font-size: 1.125rem;
`;

const Caption = styled(animated.div)`
  padding: 3rem 1.75rem 2.5rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
  line-height: 0.625rem;
  background: linear-gradient(
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.75)
  );
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

const Screen = styled(animated.div)`
  width: 320px;
  height: 640px;
  position: relative;
  background: black;
  overflow: hidden;
  border-radius: 3.75rem;
  border: 10px solid black;
`;
