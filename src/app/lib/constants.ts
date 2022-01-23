class Constants {
  get PROJECT_NAME(): string {
    return process.env.PROJECT_NAME!;
  }

  get PROJECT_DOMAIN(): string {
    return process.env.PROJECT_DOMAIN!;
  }
}

export default new Constants();
