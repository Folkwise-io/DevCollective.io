import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router";

const UserPage = () => {
  const { userId } = useParams();

  const { loading, error, data } = useQuery(
    gql`
      query Query($id: ID!) {
        user(id: $id) {
          firstName
          lastName
        }
      }
    `,
    {
      variables: {
        id: userId,
      },
    },
  );

  if (loading) return null;
  if (error) return <p>Sorry, we couldn&apos;t find that user.</p>;

  return (
    <div>
      {data.user.firstName} {data.user.lastName}
    </div>
  );
};

export default UserPage;
