import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { paths } from "../utils/paths";
import ConverterPage from "../pages/ConverterPage";
import CurrentRatesPage from "../pages/CurrentRatesPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={paths.home} element={<CurrentRatesPage />} />
      <Route path={paths.converter} element={<ConverterPage />} />
    </>
  )
);
