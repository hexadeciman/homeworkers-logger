import { Button, Card, IconButton, Input, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Fragment, useCallback, useState } from "react";
import { uuid } from "../utils/uuid";

export type Worker = {
  id: string;
  name: string;
  rate: number | string;
};

const defaultTempNewWorker: Worker = {
  name: "",
  id: uuid(),
  rate: "",
};

export const defaultWorkers: Worker[] = [
  {
    id: "1kj2k1j2kj12",
    name: "Cleaning Lady",
    rate: 25,
  },
  {
    id: "34ij4j3i4ji34",
    name: "Baby Sitter",
    rate: 20,
  },
];
export const WorkerEdition = () => {
  const [workers, saveWorkers] = useLocalStorage<Worker[]>(
    "workers",
    defaultWorkers
  );

  const [data, setData] = useState(workers);
  const save = useCallback(() => {
    saveWorkers(data);
  }, [data, saveWorkers]);

  const onEdit = useCallback(
    (
      type: "rate" | "name",
      id: string,
      value: number | string,
      source: "new" | "data" = "data"
    ) => {
      debugger;
      if (source === "data") {
        setData((old) => {
          const indexOfEntry = old.findIndex((v) => v.id === id);
          if (indexOfEntry !== -1) {
            old[indexOfEntry] = {
              ...old[indexOfEntry],
              [type]: value,
            };
          }
          return [...old];
        });
      } else {
        setTempNewWorker((old) => ({
          ...old,
          [type]: value,
        }));
      }
    },
    []
  );

  const onCancel = useCallback(() => {
    setData(workers);
  }, [workers]);
  const onDelete = useCallback((id: string) => {
    setData((old) => old.filter((v) => v.id !== id));
  }, []);

  const [tempNewWorker, setTempNewWorker] = useState(defaultTempNewWorker);
  const onAdd = useCallback(() => {
    setData((old) => [...old, tempNewWorker]);
    setTempNewWorker({ ...defaultTempNewWorker, id: uuid() });
  }, [tempNewWorker]);

  return (
    <Card className="border-gray-100 w-full h-400 !rounded-xl !shadow-lg grid grid-flow-row gap-4 p-4">
      <Typography
        className="whitespace-nowrap w-full leading-none"
        variant="h5"
        component="h5"
        fontWeight={800}
      >
        Edit Workers
      </Typography>
      <div className="grid grid-cols-[1fr_120px_min-content] gap-x-2 gap-y-4">
        <Input
          onChange={(e) => {
            onEdit("name", tempNewWorker.id, e.target.value, "new");
          }}
          value={tempNewWorker.name}
          placeholder="Add New Worker"
        />
        <Input
          onChange={(e) => {
            onEdit("rate", tempNewWorker.id, e.target.value, "new");
          }}
          value={tempNewWorker.rate}
          renderSuffix={() => <Typography fontSize={12}>CHF</Typography>}
          type="number"
          placeholder="Rate / h"
        />
        <div className="grid grid-flow-col gap-1">
          <IconButton
            aria-label="Save"
            size="small"
            className="flex justify-center"
            onClick={onAdd}
            disabled={tempNewWorker.name.trim() === "" || !tempNewWorker.rate}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </div>

        {data.map((worker) => (
          <Fragment key={worker.id}>
            <Input
              onChange={(e) => {
                onEdit("name", worker.id, e.target.value);
              }}
              value={worker.name}
            />
            <Input
              value={worker.rate}
              onChange={(e) => {
                onEdit("rate", worker.id, e.target.value);
              }}
              renderSuffix={() => <Typography fontSize={12}>CHF</Typography>}
              type="number"
              placeholder="Rate / h"
            />
            <div className="grid grid-flow-col gap-1">
              <IconButton
                aria-label="Delete"
                size="small"
                className="flex justify-center"
                onClick={() => onDelete(worker.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          </Fragment>
        ))}
      </div>
      <div className="grid grid-flow-col grid-cols-[.8fr_.2fr] gap-x-2 mt-4">
        <Button onClick={save} variant="outlined">
          Save
        </Button>
        <Button onClick={onCancel} type="reset" variant="text" color="inherit">
          Cancel
        </Button>
      </div>
    </Card>
  );
};
