const query = async (url, method, body) => {
  let opts = {
    method,
    redirect: `manual`,
  };

  if (body) {
    opts = { ...opts, headers: { "Content-Type": `application/json` }, body: JSON.stringify(body) };
  }

  // make the request and await the response.
  // throw if the response gets a network issue.
  const response = await fetch(url, opts);

  let responseBody;
  try {
    responseBody = await response.json();
  } catch (e) {}

  return {
    ok: response.ok,
    body: responseBody,
  };
};

export const get = (url) => query(url, `GET`);
export const post = (url, body) => query(url, `POST`, body);
