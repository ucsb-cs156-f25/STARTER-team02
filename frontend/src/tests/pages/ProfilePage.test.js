import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import ProfilePage from "main/pages/ProfilePage";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

let axiosMock;
let queryClient;
describe("ProfilePage tests", () => {
  queryClient = new QueryClient();

  beforeEach(() => {
    axiosMock = new AxiosMockAdapter(axios);
  });

  afterEach(() => {
    axiosMock.restore();
    axiosMock.resetHistory();
    queryClient.clear();
  });

  test("renders correctly for regular logged in user", async () => {
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Welcome/)).toBeInTheDocument();
    });
  });

  test("renders correctly for admin user", async () => {
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Welcome/)).toBeInTheDocument();
    });
    expect(screen.getByTestId("role-badge-user")).toBeInTheDocument();
    expect(screen.getByTestId("role-badge-member")).toBeInTheDocument();
    expect(screen.getByTestId("role-badge-admin")).toBeInTheDocument();
  });
});
