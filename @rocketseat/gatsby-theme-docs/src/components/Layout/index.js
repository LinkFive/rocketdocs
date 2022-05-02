/* @jsx jsx */
import { useState, useRef, Fragment } from 'react';
import { jsx, css, ThemeProvider } from '@emotion/react';
import PropTypes from 'prop-types';

import { preToCodeBlock } from 'mdx-utils';
import { MDXProvider } from '@mdx-js/react';
import TableOfContents from '../Docs/TOC';
import Sidebar from '../Sidebar';
import Header from '../Header';
import Overlay from '../Overlay';
import { Container, Main, Children } from './styles';

import defaultTheme from '../../styles/theme';
import GlobalStyle from '../../styles/global';
import Code from '../Code';

const components = {
  pre: (preProps) => {
    const props = preToCodeBlock(preProps);

    if (props) {
      return <Code {...props} />;
    }

    return <pre {...preProps} />;
  },
  inlineCode: (props) => <code className="inline-code" {...props} />,
  table: ({ children, ...rest }) => (
    <div style={{ overflowX: `auto` }}>
      <table {...rest}>{children}</table>
    </div>
  ),
};

export default function Layout({
  children,
  disableTableOfContents,
  title,
  headings,
}) {
  const contentRef = useRef(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const disableTOC =
    disableTableOfContents === true || !headings || headings.length === 0;

  const handleMenuOpen = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <MDXProvider components={components}>
        <Fragment>
          <GlobalStyle />
          <Overlay isMenuOpen={isMenuOpen} onClick={handleMenuOpen} />
          <Container>
            <Sidebar isMenuOpen={isMenuOpen} />
            <Main>
              <Header handleMenuOpen={handleMenuOpen} />
              {title && (
                <h1
                  css={css`
                    display: none;

                    @media (max-width: 1200px) {
                      display: block;
                    }
                  `}
                >
                  {title}
                </h1>
              )}
              <Children ref={contentRef}>
                {title && (
                  <h1
                    css={css`
                      @media (max-width: 1200px) {
                        display: none;
                      }
                    `}
                  >
                    {title}
                  </h1>
                )}
                {children}
              </Children>
              <TableOfContents
                headings={headings}
                disableTOC={disableTOC}
                contentRef={contentRef}
              />
            </Main>
          </Container>
        </Fragment>
      </MDXProvider>
    </ThemeProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  disableTableOfContents: PropTypes.bool,
  title: PropTypes.string,
  headings: PropTypes.array,
};

Layout.defaultProps = {
  disableTableOfContents: false,
  title: '',
  headings: null,
};
