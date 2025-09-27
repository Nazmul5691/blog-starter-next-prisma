import { Post, Prisma } from "@prisma/client"
import { prisma } from "../../config/db"

const createPost = async (payload: Prisma.PostCreateInput): Promise<Post> => {
    const result = await prisma.post.create({
        data: payload,
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
    return result;
}



const getAllPost = async ({ page = 1, limit = 10, search, isFeatured, tags, sortByTitle, orderBy }: { page?: number, limit?: number, search?: string, isFeatured?: boolean, tags?: string[], sortByTitle?: string, orderBy?: string }) => {


    const where: any = {
        AND: [
            search && {
                OR: [
                    {
                        title: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        content: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            typeof isFeatured === 'boolean' && { isFeatured },
            (tags && tags.length > 0) && { tags: { hasEvery: tags } }

        ].filter(Boolean)
    }

    // console.log({page, limit});
    // console.log(isFeatured);
    // console.log({tags});

    const skip = (page - 1) * limit;

    let orderByClause: any = { createdAt: "desc" }; // default
    if (sortByTitle && orderBy) {
        orderByClause = {
            [sortByTitle]: orderBy.toLowerCase() === "asc" ? "asc" : "desc",
        };
    }

    const result = await prisma.post.findMany({
        skip,
        take: limit,
        where,
        orderBy: orderByClause

    });


    const total = await prisma.post.count({ where })

    // return result;
    return {
        data: result,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    };
}


const getPostById = async (id: number) => {

    return await prisma.$transaction(async (tx) => {
        const updateViewCount = await tx.post.update({
            where: { id },
            data: {
                view: {
                    increment: 1
                }
            }
        });


        const result = await tx.post.findUnique({
            where: {
                id
            },
            include: {
                author: true
            }
        });

        return result;
    })



}



const updatePost = async (id: number, payload: Partial<Post>) => {
    const result = await prisma.post.update({
        where: {
            id
        },
        data: payload
    });
    return result;
}



const deletePost = async (id: number) => {
    const result = await prisma.post.delete({
        where: {
            id
        }
    });
    return result;
}


const getBlogStats = async () => {
    return await prisma.$transaction(async (tx) => {
        const aggregates = await tx.post.aggregate({
            _count: true,
            _sum: { view: true },
            _avg: { view: true },
            _max: { view: true },
            _min: { view: true }
        });

        const featuredCount = await tx.post.count({
            where: {
                isFeatured: true
            }
        });

        const topFeaturedPost = await tx.post.findFirst({
            where: {
                isFeatured: true
            },
            orderBy:{
                view: 'desc'
            }
        })

        return {
            stats: {
                totalPosts: aggregates._count ?? 0,
                totalViews: aggregates._sum.view ?? 0,
                avgViews: aggregates._avg.view ?? 0,
                minViews: aggregates._min.view ?? 0,
                maxViews: aggregates._max.view ?? 0
            },
            featured: {
                count: featuredCount,
                topPost: topFeaturedPost
            }
        };
    })
}


export const PostService = {
    createPost,
    getAllPost,
    getPostById,
    updatePost,
    deletePost,
    getBlogStats
}