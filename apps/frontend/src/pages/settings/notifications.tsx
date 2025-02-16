import LoadingPage from "@/lib/layouts/LoadingPage";
import LoggedIn from "@/lib/layouts/LoggedIn";
import { gqlClient } from "@/lib/services/api";
import {
	ActionIcon,
	Anchor,
	Box,
	Button,
	Container,
	Flex,
	Group,
	Modal,
	NumberInput,
	Paper,
	Select,
	Stack,
	Text,
	TextInput,
	Title,
	Tooltip,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
	CreateUserNotificationPlatformDocument,
	type CreateUserNotificationPlatformMutationVariables,
	DeleteUserNotificationPlatformDocument,
	type DeleteUserNotificationPlatformMutationVariables,
	TestUserNotificationPlatformsDocument,
	type TestUserNotificationPlatformsMutationVariables,
	UserNotificationPlatformsDocument,
	UserNotificationSettingKind,
} from "@ryot/generated/graphql/backend/graphql";
import { changeCase, formatTimeAgo } from "@ryot/ts-utils";
import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { type ReactElement, useState } from "react";
import { match } from "ts-pattern";
import { z } from "zod";
import type { NextPageWithLayout } from "../_app";

const createUserNotificationPlatformSchema = z.object({
	baseUrl: z
		.string()
		.url()
		.refine((val) => !val.endsWith("/"), {
			message: "Trailing slash not allowed",
		})
		.optional(),
	apiToken: z.string().optional(),
	authHeader: z.string().optional(),
	priority: z.number().optional(),
});
type CreateUserNotificationPlatformSchema = z.infer<
	typeof createUserNotificationPlatformSchema
>;

const Page: NextPageWithLayout = () => {
	const [
		createUserNotificationPlatformModalOpened,
		{
			open: openCreateUserNotificationPlatformModal,
			close: closeCreateUserNotificationPlatformModal,
		},
	] = useDisclosure(false);
	const [
		createUserNotificationPlatformLot,
		setCreateUserNotificationPlatformLot,
	] = useState<UserNotificationSettingKind>();

	const createUserNotificationPlatformForm =
		useForm<CreateUserNotificationPlatformSchema>({
			validate: zodResolver(createUserNotificationPlatformSchema),
		});

	const userNotificationPlatform = useQuery({
		queryKey: ["userNotificationPlatforms"],
		queryFn: async () => {
			const { userNotificationPlatforms } = await gqlClient.request(
				UserNotificationPlatformsDocument,
			);
			return userNotificationPlatforms;
		},
	});

	const createUserNotificationPlatform = useMutation({
		mutationFn: async (
			variables: CreateUserNotificationPlatformMutationVariables,
		) => {
			const { createUserNotificationPlatform } = await gqlClient.request(
				CreateUserNotificationPlatformDocument,
				variables,
			);
			return createUserNotificationPlatform;
		},
		onSuccess: () => {
			userNotificationPlatform.refetch();
		},
	});

	const testUserNotificationPlatforms = useMutation({
		mutationFn: async (
			variables: TestUserNotificationPlatformsMutationVariables,
		) => {
			const { testUserNotificationPlatforms } = await gqlClient.request(
				TestUserNotificationPlatformsDocument,
				variables,
			);
			return testUserNotificationPlatforms;
		},
		onSuccess: (data) => {
			if (data)
				notifications.show({
					color: "green",
					message: "Please check your notification platforms",
				});
			else
				notifications.show({
					color: "red",
					message: "Error in sending a notification",
				});
		},
	});

	const deleteUserNotificationPlatform = useMutation({
		mutationFn: async (
			variables: DeleteUserNotificationPlatformMutationVariables,
		) => {
			const { deleteUserNotificationPlatform } = await gqlClient.request(
				DeleteUserNotificationPlatformDocument,
				variables,
			);
			return deleteUserNotificationPlatform;
		},
		onSuccess: () => {
			userNotificationPlatform.refetch();
		},
	});

	return userNotificationPlatform.data ? (
		<>
			<Head>
				<title>Notification Settings | Ryot</title>
			</Head>
			<Container size="xs">
				<Stack>
					<Title>Notification settings</Title>
					{userNotificationPlatform.data.length > 0 ? (
						userNotificationPlatform.data.map((notif) => (
							<Paper p="xs" withBorder key={notif.id}>
								<Flex align="center" justify="space-between">
									<Box w="80%">
										<Text size="xs" lineClamp={1}>
											{notif.description}
										</Text>
										<Text size="xs">{formatTimeAgo(notif.timestamp)}</Text>
									</Box>
									<Group>
										<Tooltip label="Delete">
											<ActionIcon
												color="red"
												variant="outline"
												onClick={() => {
													const yes = confirm(
														"Are you sure you want to delete this notification platform?",
													);
													if (yes)
														deleteUserNotificationPlatform.mutate({
															notificationId: notif.id,
														});
												}}
											>
												<IconTrash size={16} />
											</ActionIcon>
										</Tooltip>
									</Group>
								</Flex>
							</Paper>
						))
					) : (
						<Text>No notification platforms configured</Text>
					)}
					<Box>
						<Flex justify="end">
							<Group>
								{userNotificationPlatform.data.length > 0 ? (
									<Button
										size="xs"
										variant="light"
										color="green"
										onClick={() => testUserNotificationPlatforms.mutate({})}
									>
										Trigger test notifications
									</Button>
								) : undefined}
								<Button
									size="xs"
									variant="light"
									onClick={openCreateUserNotificationPlatformModal}
								>
									Add notification platform
								</Button>
							</Group>
						</Flex>
						<Modal
							opened={createUserNotificationPlatformModalOpened}
							onClose={closeCreateUserNotificationPlatformModal}
							centered
							withCloseButton={false}
						>
							<Box
								component="form"
								onSubmit={createUserNotificationPlatformForm.onSubmit(
									(values) => {
										if (createUserNotificationPlatformLot) {
											createUserNotificationPlatform.mutate({
												input: {
													lot: createUserNotificationPlatformLot,
													...values,
												},
											});
										}
										closeCreateUserNotificationPlatformModal();
										createUserNotificationPlatformForm.reset();
										setCreateUserNotificationPlatformLot(undefined);
									},
								)}
							>
								<Stack>
									<Select
										label="Select a platform"
										required
										data={Object.values(UserNotificationSettingKind).map(
											(v) => ({ label: changeCase(v), value: v }),
										)}
										onChange={(v) => {
											if (v)
												setCreateUserNotificationPlatformLot(
													v as UserNotificationSettingKind,
												);
										}}
									/>
									{createUserNotificationPlatformLot
										? match(createUserNotificationPlatformLot)
												.with(UserNotificationSettingKind.Apprise, () => (
													<>
														<TextInput
															label="Base Url"
															required
															{...createUserNotificationPlatformForm.getInputProps(
																"baseUrl",
															)}
														/>
														<TextInput
															label="Key"
															required
															{...createUserNotificationPlatformForm.getInputProps(
																"apiToken",
															)}
														/>
													</>
												))
												.with(UserNotificationSettingKind.Discord, () => (
													<>
														<TextInput
															label="Webhook Url"
															required
															{...createUserNotificationPlatformForm.getInputProps(
																"baseUrl",
															)}
														/>
													</>
												))
												.with(UserNotificationSettingKind.Gotify, () => (
													<>
														<TextInput
															label="Server Url"
															required
															{...createUserNotificationPlatformForm.getInputProps(
																"baseUrl",
															)}
														/>
														<TextInput
															label="Token"
															required
															{...createUserNotificationPlatformForm.getInputProps(
																"apiToken",
															)}
														/>
														<NumberInput
															label="Priority"
															{...createUserNotificationPlatformForm.getInputProps(
																"priority",
															)}
														/>
													</>
												))
												.with(UserNotificationSettingKind.Ntfy, () => (
													<>
														<TextInput
															label="Topic"
															required
															{...createUserNotificationPlatformForm.getInputProps(
																"apiToken",
															)}
														/>
														<TextInput
															label="Server Url"
															{...createUserNotificationPlatformForm.getInputProps(
																"baseUrl",
															)}
														/>
														<TextInput
															label="Access token"
															description={
																<>
																	If you want to publish to a{" "}
																	<Anchor
																		size="xs"
																		href="https://docs.ntfy.sh/publish/#access-tokens"
																		target="_blank"
																		rel="noopener noreferrer"
																	>
																		protected topic
																	</Anchor>
																</>
															}
															{...createUserNotificationPlatformForm.getInputProps(
																"authHeader",
															)}
														/>
														<NumberInput
															label="Priority"
															{...createUserNotificationPlatformForm.getInputProps(
																"priority",
															)}
														/>
													</>
												))
												.with(UserNotificationSettingKind.PushBullet, () => (
													<>
														<TextInput
															label="Token"
															required
															{...createUserNotificationPlatformForm.getInputProps(
																"apiToken",
															)}
														/>
													</>
												))
												.with(UserNotificationSettingKind.PushOver, () => (
													<>
														<TextInput
															label="User Key"
															required
															{...createUserNotificationPlatformForm.getInputProps(
																"apiToken",
															)}
														/>
														<TextInput
															label="App Key"
															{...createUserNotificationPlatformForm.getInputProps(
																"baseUrl",
															)}
														/>
													</>
												))
												.with(UserNotificationSettingKind.PushSafer, () => (
													<>
														<TextInput
															label="Key"
															required
															{...createUserNotificationPlatformForm.getInputProps(
																"apiToken",
															)}
														/>
													</>
												))
												.exhaustive()
										: undefined}
									<Button
										type="submit"
										loading={createUserNotificationPlatform.isPending}
									>
										Submit
									</Button>
								</Stack>
							</Box>
						</Modal>
					</Box>
				</Stack>
			</Container>
		</>
	) : (
		<LoadingPage />
	);
};

Page.getLayout = (page: ReactElement) => {
	return <LoggedIn>{page}</LoggedIn>;
};

export default Page;
