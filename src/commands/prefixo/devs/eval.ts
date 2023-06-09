import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";
import Command from "../../../classes/Command"
import Tom5 from "../../../classes/Tom5";
import { inspect } from"util"

export class Comando extends Command {

    client: Tom5

    constructor(
        client: Tom5
    ) {
        super(
            {
                name: "eval",
                description: "[🧪] Comando para executar códigos",
                usage: "t.eval <code>",
                aliases: ["e"],
                devOnly: true,
                userPermissions: ["SendMessages", "UseApplicationCommands"],
                botPermissions: ["SendMessages", "EmbedLinks", "ManageMessages"]                
            },
        )
        this.client = client
        this.execute = async ({ctx}) => {

            var code = ctx.args?.join(` `)!

            try {
                code = await eval(code)

                if(typeof code !== "string") {
                    code = inspect(code, { depth: 0 })
                }
            } catch (err: any) {
                code = err.stack
            }

            const msg = await ctx.message?.reply(
                {
                    embeds: [
                        new EmbedBuilder()
                        .setColor("#2a2d31")
                        .setDescription(`>>> \`\`\`js\n${code}\`\`\``)
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId("del_eval")
                            .setEmoji(
                                {
                                    animated: false,
                                    id: "1013544051611533373",
                                    name: "tom5_icons_Wrong" 
                                }
                            )
                            .setStyle(ButtonStyle.Secondary)
                        )
                    ]
                }
            )

            await msg?.createMessageComponentCollector(
                {
                    componentType: ComponentType.Button,
                    time: 1 * 60 * 1000,
                    filter: (u) => u.user.id === ctx.message?.author.id
                }
            ).on("collect", async (i) => {

                if(i.customId !== "del_eval") return

                i.deferUpdate()

                ctx.message?.delete()

            })
        }
    }
}