import bcrypt from "bcrypt";

const hash = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const compare = async (suppliedPassword: string, hash: string) => {
  return await bcrypt.compare(suppliedPassword, hash);
};


export default {
    hash,
    compare
}