import React, { useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as moment from 'moment';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectDocumentList, listDocumentsAsync } from './documentsSlice';

export function DocumentList() {
  const { documents, hasPrevious, hasNext, status } = useAppSelector(selectDocumentList);
  const { projectName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(listDocumentsAsync({ projectName: projectName!, isForward: false }));
  }, [dispatch, projectName]);

  const documentKey = location.pathname.replace(/^\/projects\/(.*)\/documents\//, '');

  const handleRowClicked = useCallback(
    (key: string) => {
      navigate(`./${key}`);
    },
    [navigate],
  );

  const handlePrevBtnClicked = useCallback(() => {
    dispatch(
      listDocumentsAsync({
        projectName: projectName!,
        isForward: true,
        previousID: documents[0].id,
      }),
    );
  }, [dispatch, projectName, documents]);

  const handleNextBtnClicked = useCallback(() => {
    const lastDocument = documents[documents.length - 1];
    dispatch(
      listDocumentsAsync({
        projectName: projectName!,
        isForward: false,
        previousID: lastDocument.id,
      }),
    );
  }, [dispatch, projectName, documents]);

  return (
    <div className="py-6">
      {status === 'loading' && <div>Loading...</div>}
      {status === 'failed' && <div>Failed!</div>}
      {status === 'idle' && (
        <div className="relative">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Key
                </th>
                <th scope="col" className="px-6 py-3">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3">
                  Updated At
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document, idx) => {
                const { key, createdAt, updatedAt } = document;
                return (
                  <tr
                    key={key}
                    className={`cursor-pointer ${documentKey === key ? 'bg-gray-100' : 'hover:bg-gray-200'}`}
                    onClick={() => handleRowClicked(key)}
                  >
                    <td className="px-6 py-4 font-medium whitespace-nowrap">{key}</td>
                    <td className="px-6 py-4">{moment.unix(createdAt).format('YYYY-MM-DD')}</td>
                    <td className="px-6 py-4">{moment.unix(updatedAt).format('YYYY-MM-DD')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center space-x-2 mt-6">
        <button
          className="relative inline-flex items-center justify-center text-center py-1.5 px-3 bg-gray-100 hover:bg-gray-200 disabled:!bg-gray-300 border border-gray-300 rounded-lg focus:outline-no
          ne focus-visible:ring-4 focus-visible:ring-gray-200 font-medium text-gray-900 text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
          type="button"
          onClick={handlePrevBtnClicked}
          disabled={!hasPrevious}
        >
          <span className="flex items-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1.5 -ml-0.5 h-auto w-3.5 fill-current"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.46961 13.5303L1.93928 8.99994L6.46961 4.46961L7.53027 5.53027L3.86 8.99994L7.53027 12.4696L6.46961 13.5303Z"
              ></path>
              <path fillRule="evenodd" clipRule="evenodd" d="M13 9.75L3.5 9.65L3.5 8.3501L13 8.25V9.75Z"></path>
            </svg>
            Previous
          </span>
        </button>
        <button
          className="relative inline-flex items-center justify-center text-center py-1.5 px-3 bg-gray-100 hover:bg-gray-200 disabled:!bg-gray-300 border border-gray-300 rounded-lg focus:outline-no
          ne focus-visible:ring-4 focus-visible:ring-gray-200 font-medium text-gray-900 text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
          type="button"
          onClick={handleNextBtnClicked}
          disabled={!hasNext}
        >
          <span className="flex items-center">
            Next
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1.5 -mr-0.5 h-auto w-3.5 fill-current"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.53039 4.46973L14.0607 9.00006L9.53039 13.5304L8.46973 12.4697L12.14 9.00006L8.46973 5.53039L9.53039 4.46973Z"
              ></path>
              <path fillRule="evenodd" clipRule="evenodd" d="M3 8.25L12.5 8.35V9.65L3 9.75V8.25Z"></path>
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
