import React from "react";

interface SearchResultItem {
  title: string;
  link: string;
  snippet: string;
  htmlTitle: string;
  htmlSnippet: string;
}

interface SearchResultsProps {
  searchResults: SearchResultItem[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchResults }) => {
  return (
    <div>
      {searchResults && searchResults.length > 0 ? (
        searchResults.map((item, index) => (
          <div key={index} className="result-item">
            <h2 dangerouslySetInnerHTML={{ __html: item.htmlTitle }} />
            <p dangerouslySetInnerHTML={{ __html: item.htmlSnippet }} />
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              {item.link}
            </a>
          </div>
        ))
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchResults;
