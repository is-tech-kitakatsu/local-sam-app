import { dbMigrate } from "../../lib/task/dbMigrate";

export const handler = async (event: any) => {
  const body = JSON.parse(event.body);
  const scriptName = body.scriptName;

  try {
    const selectedScript = getSelectedScript(scriptName);
    await selectedScript();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `execute ${scriptName} successful!` }),
    };
  } catch (error: any) {
    console.error(error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "スクリプトの実行に失敗しました",
        error: error.message,
      }),
    };
  }
};

function getSelectedScript(scriptName: string): () => Promise<void> {
  switch (scriptName) {
    case "dbMigrate":
      return dbMigrate;
    default:
      throw new Error("存在しないスクリプトです");
  }
}
