import { getGroup } from "../contacts";


export async function loader({ params }) {
    const group = await getGroup(params.groupId);
    return { group };
  }