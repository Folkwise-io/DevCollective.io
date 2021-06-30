import { gql, useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

const UserPage = () => {
  const { userId } = useParams();

  const { register, handleSubmit } = useForm();

  const { loading, error, data } = useQuery(
    gql`
      query Query($id: ID!) {
        user(id: $id) {
          firstName
          lastName
          posts {
            id
            title
            body
            url
            community {
              title
            }
          }
        }
      }
    `,
    {
      variables: {
        id: userId,
      },
    },
  );

  const [submitEditUser] = useMutation(gql`
    mutation EditUserMutation($id: Int!, $firstName: String!, $lastName: String!) {
      editUser(id: $id, editUserInput: { firstName: $firstName, lastName: $lastName }) {
        id
        firstName
        lastName
      }
    }
  `);

  const onSubmit = handleSubmit((data) => {
    submitEditUser({
      variables: {
        id: parseInt(userId),
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
  });

  if (loading) return null;
  if (error) return <p>Sorry, we couldn&apos;t find that user.</p>;

  return (
    <div>
      {data.user.firstName} {data.user.lastName}
      <h2>Edit user</h2>
      <form onSubmit={onSubmit}>
        <label>First name</label>
        <input {...register(`firstName`)} />
        <label>Last name</label>
        <input {...register(`lastName`)} />
        <button>Submit</button>
      </form>
      <h2>test</h2>
      {/* {data.posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <span>Posted to {post.community.title}</span>
        </div>
      ))} */}
      <h2>Comments</h2>
    </div>
  );
};

export default UserPage;
