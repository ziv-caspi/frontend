import type { ProtoConfig } from '$lib';
import { invoke } from '@tauri-apps/api/tauri'
import { A } from 'flowbite-svelte';

export async function loadProto(dirPath: string, filePath: string): Promise<string[]> {
    return await invoke('load_proto', {depsPath: dirPath, filePath: filePath}) as string[];
}

export async function generateDefaultMessageJson(protoConfig: ProtoConfig) {
    return await invoke('gen_default_json', {
        depsPath: protoConfig.dependenciesPath,
        filePath: protoConfig.protoFilePath,
        messageName: protoConfig.currentSelectedMessage}) as string;
}

export async function publishRabbitMessage(protoConfig: ProtoConfig, params: RabbitMqParams, json: string) {
    console.log('testing rabbit');
    await invoke('create_connection', {
        params
    });

    await invoke('publish_message', {
        includesDir: protoConfig.dependenciesPath,
        protoFile: protoConfig.protoFilePath,
        messageName: protoConfig.currentSelectedMessage,
        json,
        routingKey: '/',
        strategy: "Once"
    })

    // return await invoke('publish_rabbitmq_message', {
    //     includesDir: protoConfig.dependenciesPath,
    //     protoFile: protoConfig.protoFilePath,
    //     messageName: protoConfig.currentSelectedMessage,
    //     json,
    //     params,
    // });
}

export type RabbitMqParams = {
    target_name: string,
    is_queue: boolean,
    routing_key: string, // TODO: make sure this works in the new api
    host: string,
    port: number,
    username: string,
    password: string
}