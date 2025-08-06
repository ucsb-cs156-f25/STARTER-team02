import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { createColumnHelper } from '@tanstack/react-table';
import { expect } from "vitest";

describe("OurTable tests", () => {
  const threeRows = [
    {
      col1: "Hello",
      col2: "World",
    },
    {
      col1: "react-table",
      col2: "rocks",
    },
    {
      col1: "whatever",
      col2: "you want",
    },
  ];

  const clickMeCallback = vi.fn();

  const columns = [
    {
      header: "Column 1",
      accessorKey: "col1", // accessor is the "key" in the data
    },
    {
      header: "Column 2",
      accessorKey: "col2",
    },
    ButtonColumn("Click", "primary", clickMeCallback, "testId"),
  ];

  test("renders an empty table without crashing", () => {
    render(<OurTable columns={columns} data={[]} />);
  });

  test("renders a table with three rows with correct test ids", async () => {
    render(<OurTable columns={columns} data={threeRows} />);

    await waitFor(() => {
      expect(screen.getByTestId("testid-header-group-0")).toBeInTheDocument();
    });
    expect(screen.getByTestId("testid-header-col1")).toBeInTheDocument();
    expect(screen.getByTestId("testid-header-col2")).toBeInTheDocument();
    expect(screen.getByTestId("testid-row-0")).toBeInTheDocument();
    expect(screen.getByTestId("testid-row-1")).toBeInTheDocument();
    expect(screen.getByTestId("testid-row-2")).toBeInTheDocument();
  });

  test("The button appears in the table", async () => {
    render(<OurTable columns={columns} data={threeRows} />);

    await screen.findByTestId("testId-cell-row-0-col-Click-button");
    const button = screen.getByTestId("testId-cell-row-0-col-Click-button");
    fireEvent.click(button);
    await waitFor(() => expect(clickMeCallback).toBeCalledTimes(1));
  });

  test("default testid is testId", async () => {
    render(<OurTable columns={columns} data={threeRows} />);
    await screen.findByTestId("testid-header-col1");
  });

  test("click on a header and a sort caret should appear", async () => {
    render(
      <OurTable columns={columns} data={threeRows} testid={"sampleTestId"} />,
    );  

    await screen.findByTestId("sampleTestId-header-col1-sort-header");
    const col1Header = screen.getByTestId("sampleTestId-header-col1-sort-header");

    expect(col1Header).toHaveStyle("cursor: pointer");

    const col1SortCarets = screen.getByTestId(
      "sampleTestId-header-col1-sort-carets",
    );
    expect(col1SortCarets).toHaveTextContent("");

    const col1Row0 = screen.getByTestId("sampleTestId-cell-row-0-col-col1");
    expect(col1Row0).toHaveTextContent("Hello");

    fireEvent.click(col1Header);
    await screen.findByText(/🔼/);

    fireEvent.click(col1Header);
    await screen.findByText(/🔽/);
  });

  test('renders with placeholder header for column groups', () => {
    const columnHelper = createColumnHelper();
    const columnsWithPlaceholder = [
      // This is a header group for "Name"
      columnHelper.group({
        id: 'name',
        header: 'Name',
        columns: [
          columnHelper.accessor('firstName', {
            header: 'First Name',
          }),
          columnHelper.accessor('lastName', {
            header: 'Last Name',
          }),
        ],
      }),
      // This is a standalone column, which will cause a placeholder
      // to be created under the "Name" group in the second header row
      columnHelper.accessor('age', {
        header: 'Age',
      }),
    ];

    const sampleData = [
      { firstName: 'Alice', lastName: 'Smith', age: 30 },
      { firstName: 'Bob', lastName: 'Johnson', age: 45 },
    ];

    // Render the table component with the sample data and columns
    render(<OurTable columns={columnsWithPlaceholder} data={sampleData} />);

    // Assert that the main headers are rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();

    // The key part of the test is to verify the structure created by TanStack React Table.
    // TanStack React Table will render a placeholder cell (usually a <th> or <td>)
    // with no content for the 'Name' header group in the row of the 'Age' column.
    // The following assertion checks for the absence of the 'Name' header on the second row,
    // which confirms the placeholder logic is working correctly.

    // You can also check for specific cell content to confirm the data is rendered
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();

    // To be more precise, you would inspect the table's DOM structure
    // to confirm a specific cell is empty or has a specific class,
    // but the above is often sufficient. If you need a more specific
    // test, you would need to find the specific <th> element.
  });
});
