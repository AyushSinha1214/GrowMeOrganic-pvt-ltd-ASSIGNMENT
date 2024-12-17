import React, { useState, useRef } from "react";
import { DataTable, DataTableStateEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import axios from "axios";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const ArtworkTable: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowLimit, setRowLimit] = useState<number>(0);
  const op = useRef<OverlayPanel>(null);

  // Fetch data from API
  const fetchData = async (pageNumber: number) => {
    try {
      const response = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${pageNumber + 1}&limit=5`
      );

      if (response.data && response.data.data) {
        setArtworks(response.data.data);
        setTotalRecords(response.data.pagination.total || 0);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Handle pagination
  const onPageChange = (event: DataTableStateEvent) => {
    if (typeof event.page === "number") {
      setPage(event.page);
      fetchData(event.page);
    }
  };

  const handleRowSelect = (e: any) => {
    const selected = e.value as Artwork[];

    // Allow selection only within the specified limit
    if (rowLimit && selected.length > rowLimit) {
      alert(`You can select only up to ${rowLimit} rows.`);
    } else {
      setSelectedArtworks(selected);
    }
  };

  const handleSubmit = () => {
    if (selectedArtworks.length === rowLimit) {
      console.log("Selected Artworks:", selectedArtworks);
      alert("Rows submitted successfully!");
    } else {
      alert(`Please select exactly ${rowLimit} rows before submitting.`);
    }
  };

  React.useEffect(() => {
    fetchData(page);
  }, [page]);

  return (
    <div>
      <h2>Artwork Table</h2>

      {/* Button to open Overlay Panel */}
      <Button
        label="Select Rows"
        icon="pi pi-cog"
        onClick={(e) => op.current?.toggle(e)}
        className="p-mb-3"
      />

      {/* Overlay Panel */}
      <OverlayPanel ref={op}>
        <div>
          <h4>How many rows do you want to select?</h4>
          <input
            type="number"
            placeholder="Enter number of rows"
            value={rowLimit || ""}
            onChange={(e) => setRowLimit(parseInt(e.target.value) || 0)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <Button label="Set Limit" onClick={() => op.current?.hide()} />
        </div>
      </OverlayPanel>

      {/* DataTable */}
      <DataTable
        value={artworks}
        paginator
        rows={5}
        totalRecords={totalRecords}
        lazy
        first={page * 5}
        onPage={onPageChange}
        selection={selectedArtworks}
        onSelectionChange={handleRowSelect}
        dataKey="id"
      >
        <Column selectionMode="multiple" style={{ width: "3em" }} />
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>

      {/* Submit Button */}
      <Button
        label="Submit"
        onClick={handleSubmit}
        disabled={selectedArtworks.length !== rowLimit}
        className="p-mt-3"
      />
    </div>
  );
};

export default ArtworkTable;
