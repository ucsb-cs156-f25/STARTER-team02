import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSystemInfo } from "main/utils/systemInfo";
import { renderHook } from "@testing-library/react";
import mockConsole from "jest-mock-console";

import { waitFor } from "@testing-library/react";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

jest.mock("react-router");
const { _MemoryRouter } = jest.requireActual("react-router");

let axiosMock;

describe("utils/systemInfo tests", () => {
  describe("useSystemInfo tests", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
    });

    afterEach(() => {
      axiosMock.restore();
    });
    test("useSystemInfo retrieves initial data", async () => {
      const queryClient = new QueryClient();
      const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      axiosMock.onGet("/api/systemInfo").timeout();

      const restoreConsole = mockConsole();

      const { result } = renderHook(() => useSystemInfo(), { wrapper });
      await waitFor(() => result.current.isSuccess);

      expect(result.current.data).toEqual({
        initialData: true,
        springH2ConsoleEnabled: false,
        showSwaggerUILink: false,
      });

      const queryState = queryClient.getQueryState(["systemInfo"]);
      expect(queryState).toBeDefined();
      queryClient.clear();

      await waitFor(() => expect(console.error).toHaveBeenCalled());
      const errorMessage = console.error.mock.calls[0][0];
      expect(errorMessage).toMatch(/Error invoking axios.get:/);
      restoreConsole();
    });

    test("useSystemInfo retrieves data from API", async () => {
      const queryClient = new QueryClient();
      const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingBoth);

      const { result } = renderHook(() => useSystemInfo(), { wrapper });

      await waitFor(() =>
        expect(result.current.isFetchedAfterMount).toBe(true),
      );
      expect(result.current.data).toEqual(systemInfoFixtures.showingBoth);
      queryClient.clear();
    });

    test("systemInfo when API unreachable", async () => {
      const queryClient = new QueryClient();
      const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      axiosMock.onGet("/api/systemInfo").reply(404);

      const restoreConsole = mockConsole();
      const { result } = renderHook(() => useSystemInfo(), { wrapper });

      await waitFor(() => result.current.isFetched);
      expect(console.error).toHaveBeenCalled();
      const errorMessage = console.error.mock.calls[0][0];
      expect(errorMessage).toMatch(/Error invoking axios.get:/);
      restoreConsole();

      expect(result.current.data).toEqual({
        initialData: true,
        showSwaggerUILink: false,
        springH2ConsoleEnabled: false,
      });
      queryClient.clear();
    });
  });
});
