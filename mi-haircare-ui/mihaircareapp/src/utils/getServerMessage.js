export default function getServerMessage(respOrError) {
  try {
    if (!respOrError) return null;

    // Axios error
    if (respOrError?.response) {
      const d = respOrError.response.data;
      if (!d)
        return (
          respOrError.response.statusText || String(respOrError.response.status)
        );
      if (typeof d === "string") return d;
      if (d.message) return d.message;
      if (d.data?.message) return d.data.message;
      return JSON.stringify(d);
    }

    // Axios success response or direct object
    if (respOrError?.data !== undefined) {
      const d = respOrError.data;
      if (typeof d === "string") return d;
      if (d?.message) return d.message;
      if (d?.data?.message) return d.data.message;
      return null;
    }

    // Plain string or object
    if (typeof respOrError === "string") return respOrError;
    if (respOrError?.message) return respOrError.message;

    return null;
  } catch (e) {
    return null;
  }
}
