"use client";

import React, { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { Provider } from "react-redux";
import { store } from "@/src/redux/store";

interface Props {
  children: React.ReactNode;
}

export default function Providers({children}: Props) { 
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
}