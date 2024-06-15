import { client } from "../client";
import { z } from "zod";
import { APIError } from "../utils/api-error";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../components/button-and-link";
import { Container } from "../components/container";
import { Card } from "../components/card";
import { SelectExtended } from "../components/select";
import { QueryError } from "../components/query-error";
import { InputExtended } from "../components/input";
import { useField } from "../hooks/use-field";
import { nullClamp } from "../utils/null-clamp";
import { handleSubmit } from "../form/handle-submit";
import { Loading } from "../components/loading";

const SubmitDataValidator = z.object({
  datetime: z.object({
    year: z.number().int().min(1),
    month: z.number().int().min(1).max(12),
    day: z.number().int().min(1).max(31),
    hour: z.number().int().min(0).max(23),
    minute: z.number().int().min(0).max(59),
  }),
  mapId: z.string().min(1),
  player1Id: z.string().min(1),
  player2Id: z.string().min(1),
  character1Id: z.string().min(1),
  character2Id: z.string().min(1),
  winner: z.number().int().min(1).max(2),
});

type SubmitData = z.infer<typeof SubmitDataValidator>;

const submitData = async (data: SubmitData) => {
  const response = await client.games.$post({ json: data });

  const json = await response.json();

  if (!json.ok) {
    throw new APIError(json);
  }

  return json.data;
};

const loadData = async () => {
  const [jsonMaps, jsonCharacters, jsonPlayers] = await Promise.all([
    await (await client.maps.$get()).json(),
    await (await client.characters.$get()).json(),
    await (await client.players.$get()).json(),
  ]);

  if (!jsonMaps.ok) {
    throw new APIError(jsonMaps);
  }

  if (!jsonCharacters.ok) {
    throw new APIError(jsonCharacters);
  }

  if (!jsonPlayers.ok) {
    throw new APIError(jsonPlayers);
  }

  return {
    maps: jsonMaps.data,
    characters: jsonCharacters.data,
    players: jsonPlayers.data,
  };
};

export default function Page() {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["games-create-data"],
    queryFn: loadData,
  });

  const {
    error: mutationError,
    mutateAsync,
    isPending,
  } = useMutation({
    mutationFn: submitData,
    onSuccess: ({ id }) => {
      navigate(`/games/${id}`);
    },
  });

  const yearField = useField<number | null>("year", 0);
  const monthField = useField<number | null>("month", 0);
  const dayField = useField<number | null>("day", 0);
  const hourField = useField<number | null>("hour", 0);
  const minuteField = useField<number | null>("minute", 0);

  const mapIdField = useField<string>("mapId", "");
  const player1IdField = useField<string>("player1Id", "");
  const player2IdField = useField<string>("player2Id", "");
  const character1IdField = useField<string>("character1Id", "");
  const character2IdField = useField<string>("character2Id", "");
  const winnerField = useField<1 | 2 | null>("winner", 1);

  const onSubmit = handleSubmit(
    {
      datetime: {
        year: yearField.value,
        month: monthField.value,
        day: dayField.value,
        hour: hourField.value,
        minute: minuteField.value,
      },
      mapId: mapIdField.value,
      player1Id: player1IdField.value,
      player2Id: player2IdField.value,
      character1Id: character1IdField.value,
      character2Id: character2IdField.value,
      winner: 1,
    },
    SubmitDataValidator,
    [
      yearField,
      monthField,
      dayField,
      hourField,
      minuteField,
      mapIdField,
      player1IdField,
      player2IdField,
      character1IdField,
      character2IdField,
      winnerField,
    ],
    (data) => mutateAsync(data)
  );

  return (
    <Container>
      <Card>
        {isLoading && <Loading />}
        {queryError && <QueryError error={queryError} />}
        {data && (
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-5 gap-4">
              <InputExtended
                label="Year"
                onChange={(e) =>
                  yearField.setValue(nullClamp(e.target.valueAsNumber, 1, 9999))
                }
                value={yearField.value ?? ""}
                errorMessage={yearField.error}
                type="number"
              />

              <InputExtended
                label="Month"
                onChange={(e) =>
                  monthField.setValue(nullClamp(e.target.valueAsNumber, 1, 12))
                }
                value={monthField.value ?? ""}
                errorMessage={monthField.error}
                type="number"
              />
              <InputExtended
                label="Day"
                onChange={(e) =>
                  dayField.setValue(nullClamp(e.target.valueAsNumber, 1, 31))
                }
                value={dayField.value ?? ""}
                errorMessage={dayField.error}
                type="number"
              />

              <InputExtended
                label="Hour"
                onChange={(e) =>
                  hourField.setValue(nullClamp(e.target.valueAsNumber, 0, 23))
                }
                value={hourField.value ?? ""}
                errorMessage={hourField.error}
                type="number"
              />

              <InputExtended
                label="Minute"
                onChange={(e) =>
                  minuteField.setValue(nullClamp(e.target.valueAsNumber, 0, 59))
                }
                value={minuteField.value ?? ""}
                errorMessage={minuteField.error}
                type="number"
              />
            </div>
            <SelectExtended
              label="Map"
              errorMessage={mapIdField.error}
              value={mapIdField.value}
              onChange={(e) => mapIdField.setValue(e.target.value)}
            >
              <option value={""}>...</option>
              {data.maps.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.name}
                </option>
              ))}
            </SelectExtended>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <SelectExtended
                  label="Player 1"
                  errorMessage={player1IdField.error}
                  value={player1IdField.value}
                  onChange={(e) => player1IdField.setValue(e.target.value)}
                >
                  <option value={""}>...</option>
                  {data.players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </SelectExtended>
              </div>
              <div>
                <SelectExtended
                  label="Character 1"
                  errorMessage={character1IdField.error}
                  value={character1IdField.value}
                  onChange={(e) => character1IdField.setValue(e.target.value)}
                >
                  <option value={""}>...</option>
                  {data.characters.map((character) => (
                    <option key={character.id} value={character.id}>
                      {character.name}
                    </option>
                  ))}
                </SelectExtended>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <SelectExtended
                  label="Player 2"
                  errorMessage={player2IdField.error}
                  value={player2IdField.value}
                  onChange={(e) => player2IdField.setValue(e.target.value)}
                >
                  <option value={""}>...</option>
                  {data.players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </SelectExtended>
              </div>
              <div>
                <SelectExtended
                  label="Character 2"
                  errorMessage={character2IdField.error}
                  value={character2IdField.value}
                  onChange={(e) => character2IdField.setValue(e.target.value)}
                >
                  <option value={""}>...</option>
                  {data.characters.map((character) => (
                    <option key={character.id} value={character.id}>
                      {character.name}
                    </option>
                  ))}
                </SelectExtended>
              </div>
            </div>
            <div className="flex justify-end">
              <StyledButton type="submit" disabled={isPending}>
                Submit
              </StyledButton>
            </div>
            {mutationError && <QueryError error={mutationError} />}
          </form>
        )}
      </Card>
      <pre>
        {JSON.stringify(
          {
            year: yearField.value,
            month: monthField.value,
            day: dayField.value,
            hour: hourField.value,
            minute: minuteField.value,
            mapId: mapIdField.value,
            player1Id: player1IdField.value,
            character1Id: character1IdField.value,
            player2Id: player2IdField.value,
            character2Id: character2IdField.value,
            winner: winnerField.value,
          },
          null,
          2
        )}
      </pre>
    </Container>
  );
}
