import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import {graphql} from 'gatsby';
import { css } from 'emotion';
import GithubSlugger from 'github-slugger';
import Layout from '../components/layout';
import ToC from '../components/toc';
import {extendToc} from '../utils/toc';
import Status from '../components/status';


const copyrightStyle = css`
  margin-top: 64px;
  padding-top: 8px;
  margin-right: 16px;
  border-top: 1px solid lightgrey;
`;

const articleStyle = css`
  margin-left: 300px;
  padding: 20px;

  .gatsby-highlight {
    margin: 16px 0;
  }

  .alert-banner {
    padding: 16px;
    border-left: 8px solid deepskyblue;
    background-color: aliceblue;
  }

  pre[class*="language-"] {
    overflow-x: auto;
    width: 100%;
  }

  .http-interface {
    margin: 26px 0;
    padding: 8px 20px;
    border-left: 8px solid #8BC34A;
    background-color: #e6f1d9;

    h3 {
      font-size: 12px;
      margin: 32px 0 0;
    }

    h3:first-child {
      margin-top: 8px;
    }

    pre[class*="language-"] {
      background-color: white;

      > code {
        font-size: 18px;
      }
    }

    th {
      padding: 16px;
      padding-bottom: 4px;
    }

    td {
      padding: 16px;
      background-color: white;
    }
  }

  .figure-svg {
    margin: 46px 0;

    img {
      display: block;
      margin: auto;
    }
  }


  .hiblock {
    border-left: 8px solid black;
    padding: 36px 8px 8px 20px;
    position: relative;
    margin: 26px 0;

    &::before {
      color: black;
      font-weight: bold;
      font-size: 12px;
      position: absolute;
      top: 10px;
      left: 20px;
    }
  }

  .note {
    background-color: aliceblue;
    border-left-color: deepskyblue;

    &::before {
      content: 'NOTE';
    }
  }

  .warning {
    background-color: ivory;
    border-left: 8px solid #ffcc77;

    &::before {
      content: 'WARNING';
    }
  }

  .todo {
    background-color: mistyrose;
    border-left-color: tomato;

    &::before {
      content: 'TODO';
    }
  }

  .issue {
    background-color: mistyrose;
    border-left-color: tomato;

    &::before {
      content: 'ISSUE';
    }
  }

  .example {
    background-color: ivory;
    border-left-color: darkkhaki;

    &::before {
      content: 'EXAMPLE';
    }
  }

  .experimental {
    background-color: cornsilk;
    border-left: 0;

    &::before {
      content: 'EXPERIMENTAL';
      background-color: deepskyblue;
      color: white;
      padding: 2px 4px;
    }
  }
`;

const sectionTocStyle = css`
  margin-bottom: 40px;
`;

const SectionToC = ({tree}) => {
  const slugger = new GithubSlugger();

  return (
    <ol className={sectionTocStyle}>
      {
        tree.map(el => {
          const slug = slugger.slug(el.value);
          return <li key={slug}><a href={`#${slug}`}>{el.value}</a></li>;
        })
      }
    </ol>
  );
};

SectionToC.propTypes = {
  tree: PropTypes.array.isRequired
};

const SpecSection = ({data, pageContext}) => {
  const section = data.content;
  const { toc } = pageContext;
  const tree = extendToc(toc, data.sections.edges);
  const headings = section.headings.filter(el => el.depth <= 2);
  const {title, copyright, license, version} = data.core;

  return (
    <Layout>
      <Helmet htmlAttributes={ {'lang': 'en'} }>
        <meta charSet="utf-8" />
        <title>{`${section.frontmatter.title} - ${title}`}</title>
        <link rel="canonical" href={section.frontmatter.url} />
      </Helmet>

      <ToC tree={tree} target={section.frontmatter.id} version={section.frontmatter.version} />

      <article className={articleStyle}>
        {
          section.frontmatter.version != version && section.frontmatter.version != 'next'
            ? <p className="alert-banner">The latest version of the specification is <a href={`/${version}/introduction`}>version {version}</a>.</p>
            : null
        }
        <h1>{section.frontmatter.title} <Status label={section.frontmatter.status} /></h1>
        {
          headings.length > 1
            ? <SectionToC tree={headings} />
            : null
        }
        <div dangerouslySetInnerHTML={{ __html: section.html }} />

        <p className={copyrightStyle}>
          <a href={copyright.url}>{copyright.text}</a> released under the <a href={license.url}>{license.text}</a>.
        </p>
      </article>
    </Layout>
  );
};

SpecSection.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object
};


export const query = graphql`
  query SpecSectionQuery($id: String!, $version: String!) {
    core: coreToml {
      title
      version
      copyright {
        text
        url
      }
      license {
        text
        url
      }

    }

    sections: allMarkdownRemark(filter: {frontmatter: { version: { eq: $version }}}) {
      edges {
        node {
          frontmatter {
            id
            title
            url
            status
          }
        }
      }
    }

    content: markdownRemark(frontmatter: { id: { eq: $id } }) {
      html
      headings {
        value
        depth
      }
      frontmatter {
        id
        title
        url
        status
        version
      }
    }
  }
`;

export default SpecSection;
