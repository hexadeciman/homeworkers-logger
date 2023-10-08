export const fetchDelete = async (
  urlString: string,
  params: Record<string, any> = {}
) => {
  const d = await fetch(urlString, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return await d.json();
};

export const fetchPut = async (
  urlString: string,
  params: Record<string, any> = {}
) => {
  const d = await fetch(urlString, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return await d.json();
};

export const fetchPost = async (
  urlString: string,
  params: Record<string, any> = {}
) => {
  const d = await fetch(urlString, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return await d.json();
};

export const fetchGet = async (
  urlString: string,
  params: Record<string, any> = {}
) => {
  const url = new URL(urlString);
  url.search = new URLSearchParams(params).toString();
  const d = await fetch(url.toString());
  return await d.json();
};
