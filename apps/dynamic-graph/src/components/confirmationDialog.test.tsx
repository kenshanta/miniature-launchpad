import { render, screen } from "@testing-library/react";
import ConfirmationDialog from "./confirmationDialog";

test("renders a triggered custom dialog", () => {
  render(
    <ConfirmationDialog setOpen={() => console.log("sako")} open={true} />,
  );
  const linkElement = screen.getByText(/search history/i);
  expect(linkElement).toBeInTheDocument();
});
