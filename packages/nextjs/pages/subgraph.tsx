import React, { useEffect, useMemo, useState } from "react";
import { gql, HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { useTable, useSortBy, usePagination, Column } from "react-table";

const GET_SCHEMA = gql`
  query IntrospectionQuery {
    __schema {
      types {
        name
        fields {
          name
        }
      }
    }
  }
`;

interface Schema_Query {
  __schema: __Schema;
}

interface __Schema {
  types: Types[];
}

interface Types {
  name: string;
  fields: Fields[];
}

interface Fields {
  name: string;
}

export interface SubgraphTableProps {
  uri: string;
}

export function SubgraphTable({ uri }: SubgraphTableProps) {
  const [data, setData] = useState<Schema_Query>();
  const client = useMemo(
    () =>
      new ApolloClient({
        link: new HttpLink({ uri }),
        cache: new InMemoryCache(),
      }),
    [uri],
  );

  useEffect(() => {
    const fetchData = async () => {
      //TODO: Add error handling
      const result = await client.query({ query: GET_SCHEMA });
      setData(result.data);
    };
    fetchData();
  }, [client]);

  const [, setSelectedField] = useState("");
  const [fieldProperties, setFieldProperties] = useState<Fields[]>([]);
  const [tableData, setTableData] = useState<object[]>([]);

  const formatGraphQlEntityName = (name: string) => {
    if (name.endsWith("y")) {
      return name.charAt(0).toLowerCase() + name.slice(1, -1) + "ies";
    } else {
      return name.charAt(0).toLowerCase() + name.slice(1) + "s";
    }
  };

  const pluralFields = (data as Schema_Query)?.__schema.types
    .filter(
      type =>
        type.fields !== null && !type.name.startsWith("_") && type.name !== "Query" && type.name !== "Subscription",
    )
    .map(type => ({
      ...type,
      name: formatGraphQlEntityName(type.name),
    }));

  const handleDropdownChange = async (selectedField: string) => {
    setSelectedField(selectedField);
    const properties = pluralFields?.find(field => field.name === selectedField)?.fields;
    if (!properties) return;
    setFieldProperties(properties);
    const query = gql`
        {
          ${selectedField} {
            ${properties.map(property => property.name).join("\n            ")}
          }
        }
    `;
    const tableData = await (await client.query({ query })).data[selectedField];
    setTableData(tableData);
    console.log(data);
    console.log(query.loc?.source.body);
    console.log(tableData);
  };

  const columns = React.useMemo(
    () => fieldProperties.map(field => ({ Header: field.name, accessor: field.name })),
    [fieldProperties],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    //@ts-ignore
    page,

    //@ts-ignore
    canPreviousPage,
    //@ts-ignore
    canNextPage,
    //@ts-ignore
    pageOptions,
    //@ts-ignore
    pageCount,
    //@ts-ignore
    gotoPage,
    //@ts-ignore
    nextPage,
    //@ts-ignore
    previousPage,
    //@ts-ignore
    state: { pageIndex },
  } = useTable(
    {
      columns: columns as Column[],
      data: tableData,
      //@ts-ignore
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination,
  );

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1> Subgraph Table:</h1>
      <label htmlFor="fields">Select Field:</label>
      <select id="fields" onChange={e => handleDropdownChange(e.target.value)}>
        <option value="">--Select a field--</option>
        {pluralFields.map(field => (
          <option key={field.name} value={field.name}>
            {field.name}
          </option>
        ))}
      </select>
      <br />
      <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column: any) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id}
                  style={{
                    borderBottom: "solid 3px red",
                    background: "aliceblue",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  {column.render("Header")}
                  <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: any, index: number) => {
            prepareRow(row);
            return (
              <tr key={index} {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <td
                      key={cell.id}
                      {...cell.getCellProps()}
                      style={{
                        padding: "10px",
                        border: "solid 1px gray",
                        background: "papayawhip",
                      }}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
      </div>
    </div>
  );
}

const Subgraph = () => {
  return <SubgraphTable uri="https://api.thegraph.com/subgraphs/name/blocklytics/bancor" />;
};

export default Subgraph;
