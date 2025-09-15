import Link from 'next/link';
import React from 'react';

interface IProps {
  title: string;
}

const BreadcamMenu: React.FC<IProps> = ({ title }) => {
    return (
      <div className="breadcrumb__menu" style={{}}>
      <nav>
        <ul>
          <li>
            <span>
              <Link href="/dashboard">
                <span> Home </span>
              </Link>
            </span>
          </li>
          <li className="active">
            <span> {title} </span>
          </li>
        </ul>
      </nav>
    </div>
    );
};

export default BreadcamMenu;