import type { ReactNode } from "react";
import Container from "../layout/Container";
import Row from "../layout/Row";

interface HeaderProps {
  currentTheme: string;
  topBarLeft?: ReactNode;
  topBarRight?: ReactNode;
  bottomBarLeft?: ReactNode;
  bottomBarCenter?: ReactNode;
  bottomBarRight?: ReactNode;
  sidebar?: ReactNode;
}

export default function Header({
  currentTheme,
  topBarLeft,
  topBarRight,
  bottomBarLeft,
  bottomBarCenter,
  bottomBarRight,
  sidebar,
}: HeaderProps) {
  return (
    <header>
      <Container className="header__container" variant="fluid">
        <Row
          className={`header__top-${currentTheme} gap-${2}`}
          variant="between"
        >
          {topBarLeft}
          <Row className="header__top-utilities" variant="end" gap={2}>
            {topBarRight}
          </Row>
        </Row>

        <Row className={`header__bottom-${currentTheme}`} variant="between">
          {bottomBarLeft}
          {bottomBarCenter}
          {bottomBarRight}
        </Row>

        {sidebar}
      </Container>
    </header>
  );
}
